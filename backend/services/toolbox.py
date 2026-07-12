def generate_toolbox(question, answer):

    question = question.lower()

    actions = []

    if any(word in question for word in [
        "bug",
        "error",
        "why",
        "output",
        "trace",
    ]):

        actions = [
            {"title": "Trace Execution", "type": "trace"},
            {"title": "Common Mistakes", "type": "mistakes"},
            {"title": "Coding Exercise", "type": "exercise"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Flashcards", "type": "flashcards"},
        ]

    elif any(word in question for word in [
        "difference",
        "compare",
        "vs",
    ]):

        actions = [
            {"title": "Comparison Table", "type": "compare"},
            {"title": "Real-world Example", "type": "example"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Interview Questions", "type": "interview"},
            {"title": "Flashcards", "type": "flashcards"},
        ]

    elif any(word in question for word in [
        "what",
        "define",
        "meaning",
    ]):

        actions = [
            {"title": "More Examples", "type": "examples"},
            {"title": "Another Analogy", "type": "analogy"},
            {"title": "Explain Deeper", "type": "deeper"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Flashcards", "type": "flashcards"},
        ]

    else:

        actions = [
            {"title": "Explain Deeper", "type": "deeper"},
            {"title": "Quiz", "type": "quiz"},
            {"title": "Flashcards", "type": "flashcards"},
            {"title": "Coding Exercise", "type": "exercise"},
            {"title": "Interview Questions", "type": "interview"},
        ]

    return actions