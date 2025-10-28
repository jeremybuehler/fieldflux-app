import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { BarChart3, MessageCircle, ThumbsUp, Clock } from "lucide-react"

export default function FieldFluxFelixMockup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">FieldFlux</h1>
          <p className="text-gray-600">Felix, your AI Marketing Assistant</p>
        </header>

        {/* Felix Chat Window */}
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">💬 Chat with Felix</h2>
          </CardHeader>
          <CardContent className="space-y-4 p-6 bg-white">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-gray-800 w-fit max-w-md">
                👋 Good morning! You have <b>3 new leads</b> and <b>2 reviews</b>. Would you like me to reply or post an update?
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl ml-auto text-gray-800 w-fit max-w-md">
                Create a post about our fall HVAC special.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-gray-800 w-fit max-w-md">
                Got it! Here's a preview 👇
              </div>
            </motion.div>

            {/* Post Preview Card */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="space-y-3 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1602491674160-0e9d9b9cbbfa?auto=format&fit=crop&w=800&q=60"
                  alt="Fall HVAC Special"
                  className="rounded-xl w-full h-48 object-cover"
                />
                <Textarea defaultValue="🍂 Keep cozy this fall with our seasonal HVAC tune-up special! Call today for priority scheduling." className="w-full border-gray-200" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline">Edit</Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Approve & Schedule</Button>
              </CardFooter>
            </Card>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-gray-800 w-fit max-w-md">
                ✅ Scheduled for 9:00 AM tomorrow on Facebook & Instagram.
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="p-4 bg-gray-50 border-t flex gap-3">
            <Textarea placeholder="Type your message..." className="flex-1 resize-none" />
            <Button className="bg-blue-600 text-white hover:bg-blue-700">Send</Button>
          </CardFooter>
        </Card>

        {/* Insights Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 flex flex-col items-center text-center shadow-sm border-gray-100">
            <BarChart3 className="text-blue-600 mb-2" size={28} />
            <h3 className="font-semibold text-gray-800">+18% Engagement</h3>
            <p className="text-sm text-gray-500">Week-over-week growth</p>
          </Card>
          <Card className="p-4 flex flex-col items-center text-center shadow-sm border-gray-100">
            <MessageCircle className="text-green-600 mb-2" size={28} />
            <h3 className="font-semibold text-gray-800">4.8★ Reviews</h3>
            <p className="text-sm text-gray-500">Avg customer rating</p>
          </Card>
          <Card className="p-4 flex flex-col items-center text-center shadow-sm border-gray-100">
            <Clock className="text-yellow-600 mb-2" size={28} />
            <h3 className="font-semibold text-gray-800">2h Lead Response</h3>
            <p className="text-sm text-gray-500">Avg time to first contact</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
