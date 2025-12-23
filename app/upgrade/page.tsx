import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Info } from "lucide-react"
import Link from "next/link"

export default async function UpgradePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const plans = [
    {
      name: "Gold",
      discount: "35% OFF!",
      validText: "Valid for today",
      originalPrice: "₹5,500",
      price: "₹3,600",
      perMonth: "₹1200 per month",
      duration: "Valid for 3 months",
      features: [
        { text: "View 40 Phone Nos", enabled: true },
        { text: "Send unlimited messages", enabled: true },
        { text: "Unlimited horoscope views", enabled: true },
        { text: "View verified profiles with photos", enabled: false },
      ],
      badge: null,
    },
    {
      name: "Prime Gold",
      discount: "44% OFF!",
      validText: "Valid for today",
      originalPrice: "₹7,900",
      price: "₹4,400",
      perMonth: "₹1467 per month",
      duration: "Valid for 3 months",
      features: [
        { text: "View unlimited Phone Nos*", enabled: true, info: true },
        { text: "Send unlimited messages", enabled: true },
        { text: "Unlimited horoscope views", enabled: true },
        { text: "View verified profiles with photos", enabled: true },
      ],
      badge: null,
    },
    {
      name: "Prime - Till U Marry",
      discount: "58% OFF!",
      validText: "Valid for today",
      originalPrice: "₹23,700",
      price: "₹9,900",
      perMonth: "₹825 per month",
      duration: "Longest validity plan",
      features: [
        { text: "View unlimited Phone Nos*", enabled: true, info: true },
        { text: "Send unlimited messages", enabled: true },
        { text: "Unlimited horoscope views", enabled: true },
        { text: "View verified profiles with photos", enabled: true },
      ],
      badge: "Best Seller",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-8 text-center border-b">
        <h1 className="text-4xl font-bold mb-4">
          Special <span className="bg-purple-700 text-white px-4 py-1 rounded-lg">Offer</span>
        </h1>
        <p className="text-2xl mb-2">
          <span className="font-semibold">Save upto 58%</span> <span className="text-3xl font-bold mx-2">+</span>{" "}
          <span className="text-purple-800 font-bold">21 Days Money Back Guarantee!</span>
        </p>
        <p className="text-gray-600">Offer ends today</p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${plan.badge ? "border-red-500 border-2" : "border-gray-200"}`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <CardContent className="p-6">
                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-center mb-6 pt-2">{plan.name}</h2>

                {/* Discount Badge */}
                <div className="text-center mb-4">
                  <span className="text-teal-600 font-bold text-lg">{plan.discount}</span>{" "}
                  <span className="text-gray-700">{plan.validText}</span>
                </div>

                {/* Pricing */}
                <div className="text-center mb-2">
                  <span className="text-gray-400 line-through text-lg mr-2">{plan.originalPrice}</span>
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>

                <div className="text-center mb-6">
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {plan.perMonth}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{plan.duration}</span>
                    {plan.duration.includes("Longest") && <Info className="h-4 w-4 text-gray-400" />}
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check
                        className={`h-5 w-5 flex-shrink-0 ${feature.enabled ? "text-green-600" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${feature.enabled ? "text-gray-700" : "text-gray-400 line-through"}`}>
                        {feature.text}
                      </span>
                      {feature.info && <Info className="h-4 w-4 text-gray-400" />}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 rounded-full text-lg">
                  Pay Now
                </Button>

                {plan.badge && (
                  <div className="text-center mt-4">
                    <Link
                      href="#"
                      className="text-orange-600 font-medium text-sm flex items-center justify-center gap-1"
                    >
                      Know More →
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <Link href="#" className="underline">
            View All Packages
          </Link>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="outline" className="px-8 bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
