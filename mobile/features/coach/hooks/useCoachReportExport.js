import { useState } from 'react';
import { Alert } from 'react-native';
import { exportCoachSummaryAsPdf } from '../../../utils/coachExport';

export function useCoachReportExport({ summary, loading, error, hasSessions, formatOptions }) {
    const [exporting, setExporting] = useState(false);

    const canExportCoachReport = !loading && !error && !!summary && hasSessions && !exporting;

    const exportCoachReport = async () => {
        if(!canExportCoachReport) return;

        try {
            setExporting(true);
            await exportCoachSummaryAsPdf(summary, formatOptions);
        } catch(err) {
            Alert.alert(
                'Export non riuscito',
                err?.message || 'Non è stato possibile esportare il report Coach.'
            );
        } finally {
            setExporting(false);
        }
    };

    return {
        exporting,
        canExportCoachReport,
        exportCoachReport,
    };
}