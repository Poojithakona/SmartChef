import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ChefHat, Mic, BookOpen, Camera, Sparkles, Menu, X, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "./context/AuthContext";

const AuthModal = ({ mode, onClose, onSwitch }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate("/home");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/ \(auth.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <ChefHat className="w-7 h-7 text-orange-600" />
          <span className="text-xl font-bold">SmartChef</span>
        </div>

        <h2 className="text-2xl font-bold mb-1">{mode === "login" ? "Welcome back!" : "Create account"}</h2>
        <p className="text-gray-500 text-sm mb-6">{mode === "login" ? "Sign in to continue cooking" : "Join SmartChef today"}</p>

        {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          )}
          <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <div className="relative">
            <input required type={show ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition disabled:opacity-60">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={onSwitch} className="text-orange-600 font-semibold hover:underline">
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Cooking Assistant",
      desc: "Hands-free cooking with integrated voice support and real-time chat guidance.",
      icon: <Mic className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Recipe Management",
      desc: "Easily organize, edit, and save your favorite culinary masterpieces in one place.",
      icon: <BookOpen className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Image Recognition",
      desc: "Snap a photo of your ingredients or dish for instant AI-powered analysis.",
      icon: <Camera className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Smart Recommendations",
      desc: "Personalized meal suggestions based on your taste preferences and dietary needs.",
      icon: <Sparkles className="w-8 h-8 text-orange-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 scroll-smooth">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">SmartChef</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-orange-600 transition-colors">Home</a>
              <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
              <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
             <div className="flex gap-3">
  <button onClick={() => setAuthMode('login')} className="px-5 py-2 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition">
    Login
  </button>

  <button onClick={() => setAuthMode('signup')} className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition shadow-md">
    Signup
  </button>
</div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
              Cook Smart <br />
              <span className="text-orange-600">with AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Your intelligent cooking assistant that guides you step-by-step.
            </p>
           <button
  onClick={() => setAuthMode('login')}
  className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition-all flex items-center gap-2"
>
  Start Cooking <ChevronRight />
</button>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
              alt="Cooking"
              className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

     
      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-all">
                <div className="mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
       <section id="contact" className="py-20 bg-orange-50 text-center">
  <h2 className="text-4xl font-bold mb-6">Contact Us</h2>

  <p className="text-gray-600 mb-4">
    Have questions? Reach out to Team TriAstra
  </p>

  <p className="text-lg">
    📧 
    <a href="mailto:smartchef.team@gmail.com" className="text-orange-600">
      smartchef.team@gmail.com
    </a>
  </p>
</section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 text-center">
        <p>© 2026 SmartChef AI. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}
    </div>
  );
};

export default LandingPage;