import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo") || "null");
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchBuyCourseData = async () => {
      if (!token) {
        setError("Please login first");
        return;
      }

      try {
        setLoading(true);

        console.log("Course ID:", id);

        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("FULL RESPONSE:", response.data);

        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.log(error);

        if (error.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(
            error?.response?.data?.message || "Something went wrong"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBuyCourseData();
  }, [id, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      toast.error("Card element not found");
      return;
    }

    if (!clientSecret) {
      toast.error("Client secret missing");
      return;
    }

    try {
      setLoading(true);

      const { error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (paymentMethodError) {
        setCardError(paymentMethodError.message);
        setLoading(false);
        return;
      }

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: user?.user?.firstName,
              email: user?.user?.email,
            },
          },
        });

      if (confirmError) {
        setCardError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Payment Success:", paymentIntent);

        const paymentInfo = {
          email: user?.user?.email,
          userId: user?.user?._id,
          courseId: id,
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
        };

        console.log("Payment Info:", paymentInfo);

        await axios.post(
          `${BACKEND_URL}/order`,
          paymentInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        toast.success("Payment Successful");

        navigate("/purchases");
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>

            <Link
              to="/purchases"
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto px-4">
          {/* Left Side */}
          <div className="w-full md:w-1/2 mb-10">
            <h1 className="text-2xl font-bold underline">
              Order Details
            </h1>

            <div className="flex items-center gap-2 mt-4">
              <h2 className="text-gray-600">Total Price:</h2>
              <p className="text-red-500 font-bold">
                ${course?.price}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <h2 className="text-gray-600">Course Name:</h2>
              <p className="text-blue-500 font-bold">
                {course?.title}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Process Your Payment
              </h2>

              <form onSubmit={handlePurchase}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />

                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </form>

              {cardError && (
                <p className="text-red-500 text-sm mt-3">
                  {cardError}
                </p>
              )}

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-4 flex items-center justify-center">
                <span className="mr-2">🅿️</span>
                Other Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;