import React, { useEffect } from "react";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  // Redirect only when loading is false and the user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, loading, navigateTo]);

  // Stripe integration
  const makePayment = async () => {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_Publishable_key
    );
    const response = await axios.post(
      `http://localhost:3000/api/v1/stripe/create-checkout-session`,
      {
        Auctioneer_Unpaid_Comission: user.unpaidCommission,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // when customer will click on "Pay Now" Button a request will be gone to backend & a session will be created with
    // stripe service also from  backend response we will get session's id basis of that session id customer will be
    //  redirected to stripe checkout page to safely collect payment after collecting payment we will redirect customer back
    // to our website.

    const result = stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      console.log("Error during checkout page in Stripe :::", result.error);
    }
  };

   // Showing a loading spinner while checking if the user is authenticated
   if (loading) {
    return <Spinner />;
  }

 // If the user is not logged in, stop rendering this page
   if (!isAuthenticated) {
    navigateTo("/");
   }

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
            <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
              <img
                src={user.profileImage?.url}
                alt="/imageHolder.jpg"
                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-55 lg:h-55 rounded-full object-cover"
              />

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.username}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="text"
                      defaultValue={user.email}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="number"
                      defaultValue={user.phoneNumber}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={user.address}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <input
                      type="text"
                      defaultValue={user.role}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Joined On
                    </label>
                    <input
                      type="text"
                      defaultValue={user.createdAt?.substring(0, 10)}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {user.role === "Auctioneer" && (
                <div className="mb-6 w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.paymentMethods.bankTransfer.bankName}
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bank Account (IBAN)
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.bankTransfer.bankAccountNumber
                        }
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User Name On Bank Account
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.bankTransfer.bankAccountName
                        }
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Easypaisa Account Number
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.easypaisa.easypaisaAccountNumber
                        }
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Paypal Email
                      </label>
                      <input
                        type="text"
                        defaultValue={user.paymentMethods.paypal.paypalEmail}
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4">Other Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.role === "Auctioneer" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Unpaid Commissions
                        </label>
                        <input
                          type="text"
                          defaultValue={user.unpaidCommission}
                          className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                          disabled
                        />
                        {user.unpaidCommission > 0 ? (
                          <button
                            className="bg-[#D6482B] font-semibold hover:bg-[#b8381e] text-xl py-1 px-4 rounded-md text-white"
                            type="button"
                            onClick={makePayment}
                          >
                            Pay Now{" "}
                          </button>
                        ) : null}
                      </div>
                    </>
                  )}
                  {user.role === "Bidder" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Auctions Won
                        </label>
                        <input
                          type="text"
                          defaultValue={user.auctionWon}
                          className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Money Spent
                        </label>
                        <input
                          type="text"
                          defaultValue={user.moneySpent}
                          className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
      </section>
    </>
  );
};

export default UserProfile;
