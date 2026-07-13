def generate_toolbox(question, answer):
    question = question.lower()
    actions = []

    # Map the actions dynamically based on keywords in the question
    if any(word in question for word in ["bug", "error", "why", "output", "trace"]):
        actions = [
            {"title": "Revision Notes", "type": "revision"},
            {"title": "Coding Exercise", "type": "exercise"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Flashcards", "type": "flashcards"},
        ]
    elif any(word in question for word in ["difference", "compare", "vs"]):
        actions = [
            {"title": "Revision Notes", "type": "revision"},
            {"title": "Practical Examples", "type": "examples"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Mock Interview", "type": "interview"},
            {"title": "Flashcards", "type": "flashcards"},
        ]
    elif any(word in question for word in ["what", "define", "meaning"]):
        actions = [
            {"title": "Practical Examples", "type": "examples"},
            {"title": "Real-world Analogy", "type": "analogy"},
            {"title": "Revision Notes", "type": "revision"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Flashcards", "type": "flashcards"},
        ]
    else:
        actions = [
            {"title": "Revision Notes", "type": "revision"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Flashcards", "type": "flashcards"},
            {"title": "Coding Exercise", "type": "exercise"},
            {"title": "Mock Interview", "type": "interview"},
        ]

    return actions