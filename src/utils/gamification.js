import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

export const ACTIONS = {
    MOOD_LOG: { points: 10, label: 'Mood Logged' },
    JOURNAL: { points: 15, label: 'Journal Entry' },
    MEDITATION: { points: 20, label: 'Meditation' },
    SLEEP_LOG: { points: 10, label: 'Sleep Logged' },
    QUIZ: { points: 15, label: 'Grounding Quiz' },
    GAME_WIN: { points: 5, label: 'Game Victory' }
};

export const addPoints = async (userId, actionKey) => {
    if (!userId || !ACTIONS[actionKey]) return;

    const action = ACTIONS[actionKey];
    const statsRef = doc(db, 'users', userId, 'stats', 'gamification');

    try {
        await setDoc(statsRef, {
            totalPoints: increment(action.points),
            lastAction: action.label,
            updatedAt: serverTimestamp()
        }, { merge: true });

        // Level calculation (100 pts per level)
        const snap = await getDoc(statsRef);
        const total = snap.data()?.totalPoints || 0;
        const currentLevel = Math.floor(total / 100) + 1;

        await setDoc(statsRef, { level: currentLevel }, { merge: true });

        return { pointsGained: action.points, total, level: currentLevel };
    } catch (error) {
        console.error("Error adding points:", error);
    }
};
