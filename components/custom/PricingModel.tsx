// import Lookup from '@/data/Lookup'
// import React from 'react'
// import { Button } from '../ui/button'

// const PricingModel = () => {
//     return (
//         <div className=' mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
//             {Lookup.PRICING_OPTIONS.map((pricing, index) => (
//                 <div key={index} className=' border p-7 rounded-xl flex flex-col gap-3'>
//                     <h2 className=' font-bold text-2xl'>{pricing.name}</h2>
//                     <h2 className=' font-medium text-lg'>{pricing.tokens}</h2>
//                     <p className=' text-gray-400'>{pricing.desc}</p>

//                     <h2 className=' font-bold text-4xl text-center mt-6'>${pricing.price}</h2>

//                     <Button>Upgrade to{pricing.name}</Button>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default PricingModel








"use client";

import Lookup from "@/data/Lookup";
import React from "react";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext } from "react";

const PricingModel = () => {
    const { userDetail } = useContext(UserDetailContext);
    const onPayment = async (
        pricing: (typeof Lookup.PRICING_OPTIONS)[number]
    ) => {
        if (!userDetail?._id) {
            console.error("User not found");
            return;
        }

        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: pricing.name,
                    value: pricing.value,
                    userId: userDetail._id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Payment session failed");
            }

            if (data.url) {
                window.location.assign(data.url);
            }
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Lookup.PRICING_OPTIONS.map((pricing, index) => (
                <div
                    key={index}
                    className="border p-7 rounded-xl flex flex-col gap-3"
                >
                    <h2 className="font-bold text-2xl">{pricing.name}</h2>

                    <h2 className="font-medium text-lg">{pricing.tokens}</h2>

                    <p className="text-gray-400">{pricing.desc}</p>

                    <h2 className="font-bold text-4xl text-center mt-6">
                        ${pricing.price}
                    </h2>

                    <Button onClick={() => onPayment(pricing)}>
                        Upgrade to {pricing.name}
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default PricingModel;