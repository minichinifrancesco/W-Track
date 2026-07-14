import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getWeeklyCoachSummary } from '../../../services/api';
import { 
    addDays, 
    isSameWeekStart, 
    startOfWeek, 
    toLocalDateKey, 
    WEEK_STEP_DAYS 
} from '../utils/coachDate';

export function useWeeklyCoachSummary(authToken) {
    const requestIdRef = useRef(0);

    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const isCurrentWeek = useMemo(() => isSameWeekStart(weekStart, new Date()), [weekStart]);

    const loadSummary = useCallback(
        async({ showLoader = true } = {}) => {
            const requestId = requestIdRef.current + 1;
            requestIdRef.current = requestId;

            if(!authToken) {
                setError('Sessione non valida. Effettua di nuovo il login.');
                setLoading(false);
                setRefreshing(false);
                return;
            }

            if(showLoader) {
                setLoading(true);
            }

            try {
                setError('');
                const data = await getWeeklyCoachSummary(authToken, toLocalDateKey(weekStart));
                if(requestIdRef.current === requestId) {
                    setSummary(data);
                }
            } catch(err) {
                if(requestIdRef.current === requestId) {
                    setError(err.message || 'Errore caricamento dashboard Coach.');
                }
            } finally {
                if(requestIdRef.current === requestId) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        }, [authToken, weekStart]
    );

    useEffect(() => {loadSummary();}, [loadSummary]);

    const goToPreviousWeek = useCallback(() => {
        if(loading || refreshing) return;

        setWeekStart((current) => addDays(current, -WEEK_STEP_DAYS));
    }, [loading, refreshing]);

    const goToNextWeek = useCallback(() => {
        if(loading || refreshing || isCurrentWeek) return;

        setWeekStart((current) => addDays(current, WEEK_STEP_DAYS));
    }, [isCurrentWeek, loading, refreshing]);

    const goToCurrentWeek = useCallback(() => {
        if(loading || refreshing) return;

        setWeekStart(startOfWeek(new Date()));
    }, [loading, refreshing]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        loadSummary({ showLoader: false });
    }, [loadSummary]);

    return {
        weekStart,
        summary,
        loading,
        refreshing,
        error,
        isCurrentWeek,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        refresh,
    };
}