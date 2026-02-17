const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson'); // Use this to fetch lessons from the DB

// Fetch lessons by language and level
const getLessonsByLanguageAndLevel = async (req, res) => {
  const { language, level } = req.query;

  if (!language || !level) {
    return res.status(400).json({ message: 'Language and level are required' });
  }

  try {
    const lessons = await Lesson.find({ language, level }).sort({ order: 1 }); // Sort lessons by the order field (if exists)
    
    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ message: 'No lessons found for this language and level' });
    }

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons from the DB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Mark lesson as completed and return next lesson
const markLessonCompleted = async (req, res) => {
  const userId = req.user._id; // User ID from the logged-in user
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ message: 'Lesson ID is required' });
  }

  try {
    let progress = await Progress.findOne({ user: userId });

    // Create a new progress entry if the user does not have one
    if (!progress) {
      progress = new Progress({
        user: userId,
        completedLessons: [lessonId],
        lastCompletedLesson: lessonId,
      });
    } else {
      // Check if the lesson has already been completed
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.lastCompletedLesson = lessonId;
      }
    }

    await progress.save();

    // Now fetch the next lesson based on the current progress
    const language = req.query.language;
    const level = req.query.level;

    // Fetch lessons from the DB
    const lessonList = await Lesson.find({ language, level }).sort({ order: 1 });

    if (!lessonList || lessonList.length === 0) {
      return res.status(400).json({ message: 'Invalid language or level' });
    }

    const currentIndex = lessonList.findIndex((lesson) => lesson.id === lessonId);

    let nextLesson = null;

    if (currentIndex !== -1 && currentIndex < lessonList.length - 1) {
      nextLesson = lessonList[currentIndex + 1]; // Get the next lesson
    }

    res.status(200).json({
      message: 'Lesson marked as completed',
      nextLessonId: nextLesson ? nextLesson.id : null, // Return next lesson ID
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch the next lesson based on progress
const getNextLesson = async (req, res) => {
  const userId = req.user._id; // User ID from the logged-in user
  const { language, level } = req.query;

  if (!language || !level) {
    return res.status(400).json({ message: 'Language and level are required' });
  }

  try {
    const progress = await Progress.findOne({ user: userId });

    if (!progress || !progress.lastCompletedLesson) {
      return res.status(200).json({ nextLessonId: null }); // No progress yet, return null
    }

    const lessonList = await Lesson.find({ language, level }).sort({ order: 1 });

    if (!lessonList || lessonList.length === 0) {
      return res.status(400).json({ message: 'Invalid language or level' });
    }

    const currentIndex = lessonList.findIndex((lesson) => lesson.id === progress.lastCompletedLesson);

    if (currentIndex === -1 || currentIndex === lessonList.length - 1) {
      return res.status(200).json({ nextLessonId: null }); // No next lesson
    }

    const nextLesson = lessonList[currentIndex + 1];
    res.status(200).json({ nextLessonId: nextLesson.id });
  } catch (error) {
    console.error('Error fetching next lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getLessonsByLanguageAndLevel,
  markLessonCompleted,
  getNextLesson, // Exporting the getNextLesson function
};
