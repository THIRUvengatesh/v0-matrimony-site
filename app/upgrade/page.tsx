import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Info } from "lucide-react"
import Link from "next/link"

interface MembershipFeature {
  text: string
  enabled: boolean
  highlight?: boolean
  hasInfo?: boolean
}

interface MembershipPlan {
  id: string
  name: string
  display_name: string
  description: string
  duration_months: number
  original_price: number
  discounted_price: number
  discount_percentage: number
  features: MembershipFeature[]
  is_best_seller: boolean
}

export default async function UpgradePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: plansData, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching plans:", error)
  }

  const plans: MembershipPlan[] = plansData || []

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
          {plans.map((plan) => {
            const perMonthPrice = Math.round(plan.discounted_price / plan.duration_months)

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${plan.is_best_seller ? "border-red-500 border-2" : "border-gray-200"}`}
              >
                {plan.is_best_seller && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Best Seller
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Plan Name */}
                  <h2 className="text-2xl font-bold text-center mb-6 pt-2">{plan.display_name}</h2>

                  {/* Discount Badge */}
                  <div className="text-center mb-4">
                    <span className="text-teal-600 font-bold text-lg">{plan.discount_percentage}% OFF!</span>{" "}
                    <span className="text-gray-700">Valid for today</span>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-2">
                    <span className="text-gray-400 line-through text-lg mr-2">
                      ₹{plan.original_price.toLocaleString()}
                    </span>
                    <span className="text-4xl font-bold">₹{plan.discounted_price.toLocaleString()}</span>
                  </div>

                  <div className="text-center mb-6">
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      ₹{perMonthPrice} per month
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check
                          className={`h-5 w-5 flex-shrink-0 ${feature.enabled ? "text-green-600" : "text-gray-300"}`}
                        />
                        <span className={`text-sm ${feature.enabled ? "text-gray-700" : "text-gray-400 line-through"}`}>
                          {feature.text}
                        </span>
                        {feature.hasInfo && <Info className="h-4 w-4 text-gray-400" />}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 rounded-full text-lg">
                    Pay Now
                  </Button>

                  {plan.is_best_seller && (
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
            )
          })}
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
