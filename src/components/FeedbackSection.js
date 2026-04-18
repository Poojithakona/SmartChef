import { Star } from "lucide-react";
import { useState } from "react";

const FeedbackSection = ({ recipeName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const submit = () => {
    if (!rating) {
      alert("Please select a rating ⭐");
      return;
    }

    alert(`Thanks! You rated ${recipeName} ${rating}/5 ⭐`);

    setReview("");
    setRating(0);
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-md">

      <h3 className="text-xl font-bold mb-2">
        Rate this recipe
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Your feedback helps others 🍳
      </p>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((v) => {
          const active = v <= (hover || rating);

          return (
            <button
              key={v}
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(v)}
            >
              <Star
                size={30}
                className={active ? "text-yellow-500" : "text-gray-300"}
                fill={active ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>

      {/* Review */}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        className="w-full border p-2 rounded mb-4"
        rows={4}
      />

      {/* Button */}
      <button
        onClick={submit}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackSection;