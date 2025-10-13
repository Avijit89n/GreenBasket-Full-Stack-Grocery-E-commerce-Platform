import bannerImager from "../../assets/aboutBanner.png"

export default function About() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-400 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Freshness delivered to your doorstep — your trusted online grocery partner.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src={bannerImager}
          alt="Grocery Delivery"
          className="rounded-2xl shadow-lg w-full object-cover"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-green-700">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to bring you the best quality groceries, sourced fresh every day and delivered
            straight to your door. Our mission is to make grocery shopping simple, fast, and
            affordable for every household.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">Our Core Values</h2>
          <p className="text-gray-600">
            These principles guide everything we do.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-3">🍃</div>
            <h3 className="text-xl font-semibold mb-2">Freshness First</h3>
            <p className="text-gray-600 text-sm">
              Only the freshest produce and best quality products, always.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Your groceries delivered within minutes, not hours.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-3">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Customer Love</h3>
            <p className="text-gray-600 text-sm">
              We prioritize your satisfaction with reliable service and care.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
