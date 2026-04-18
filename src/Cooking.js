import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import { useRecipes } from "./context/RecipeContext";
import IngredientsPanel from "./components/IngredientsPanel";
import StepsPanel from "./components/StepsPanel";
import AIAssistant from "./components/AIAssistant";
import FeedbackSection from "./components/FeedbackSection";
const Cooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes } = useRecipes();

  const recipe = useMemo(
    () => recipes.find((r) => r.id === Number(id)),
    [id, recipes]
  );

  const [step, setStep] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="p-8 text-center border rounded-xl bg-white">
          <h2 className="text-2xl font-bold mb-2">Recipe not found</h2>
          <p className="mb-4 text-gray-500">This recipe doesn't exist.</p>

          <button
            onClick={() => navigate("/home")}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Back to recipes
          </button>
        </div>
      </div>
    );
  }

  const next = () =>
    setStep((s) => Math.min(s + 1, recipe.steps.length - 1));
  const prev = () =>
    setStep((s) => Math.max(s - 1, 0));
  const repeat = () => setStep((s) => s);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
        <Link to="/home" className="flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft size={16} />
          Back
        </Link>

        <h1 className="text-sm font-bold">
          Cooking: {recipe.name}
        </h1>

        <div></div>
      </header>

      {/* Main Layout */}
      <main className="p-4 grid lg:grid-cols-12 gap-6">

        {/* Ingredients */}
        <div className="lg:col-span-3">
          <IngredientsPanel recipe={recipe} />
        </div>

        {/* Steps */}
        <div className="lg:col-span-6">
          <StepsPanel
            steps={recipe.steps}
            current={step}
            onNext={next}
            onPrev={prev}
            onRepeat={repeat}
          />
        </div>

        {/* AI Assistant (Desktop) */}
        <div className="hidden lg:block lg:col-span-3">
          <AIAssistant
            recipe={recipe}
            currentStep={recipe.steps[step].title}
          />
        </div>

      </main>

      {/* Feedback */}
      <div className="p-4">
        <FeedbackSection recipeName={recipe.name} />
      </div>

      {/* Mobile AI Button */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white px-4 py-3 rounded-full flex items-center gap-2"
      >
        <Sparkles size={16} />
        Ask AI
      </button>

      {/* Mobile AI Drawer */}
      {aiOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end">
          <div className="bg-white w-full h-[80%] rounded-t-xl p-3 relative">

            <button
              onClick={() => setAiOpen(false)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <AIAssistant
              recipe={recipe}
              currentStep={recipe.steps[step].title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cooking;