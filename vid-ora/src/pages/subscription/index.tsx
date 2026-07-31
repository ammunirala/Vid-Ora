import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    color: "border-gray-300",
    features: [
      "1 Download / Day",
      "30 min Watch Time",
      "Ads Enabled",
      "Basic Videos",
    ],
  },
  {
    name: "Bronze",
    price: "₹99 / month",
    color: "border-orange-400",
    features: [
      "10 Downloads / Day",
      "Unlimited Watch Time",
      "Ad Free",
      "Bronze Videos",
    ],
  },
  {
    name: "Silver",
    price: "₹199 / month",
    color: "border-gray-500",
    features: [
      "25 Downloads / Day",
      "Unlimited Watch Time",
      "Ad Free",
      "Silver Videos",
    ],
  },
  {
    name: "Gold",
    price: "₹399 / month",
    color: "border-yellow-500",
    features: [
      "Unlimited Downloads",
      "Unlimited Watch Time",
      "Ad Free",
      "All Premium Videos",
    ],
  },
];

export default function SubscriptionPage() {
  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold text-center mb-3">
        Upgrade Your Plan
      </h1>

      <p className="text-center text-gray-500 mb-10">
        Choose a subscription plan to unlock premium features.
      </p>

      <div className="grid md:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`border-2 ${plan.color} rounded-xl p-6 shadow-sm`}
          >
            <h2 className="text-2xl font-bold">
              {plan.name}
            </h2>

            <h3 className="text-3xl font-bold my-5">
              {plan.price}
            </h3>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full">
              {plan.name === "Free"
                ? "Current Plan"
                : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}