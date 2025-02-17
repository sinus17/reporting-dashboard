import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Report } from '../types/report';
import { ReportHeader } from '../components/reports/ReportHeader';
import { ReportMetrics } from '../components/reports/ReportMetrics';
import { ReportCharts } from '../components/reports/ReportCharts';
import { ReportTable } from '../components/reports/ReportTable';
import { DateRangePicker } from '../components/reports/DateRangePicker';
import { EditReportModal } from '../components/reports/EditReportModal';
import { toast } from 'react-hot-toast';
import { useSupabaseQuery, useSupabaseMutation } from '../hooks/useSupabaseQuery';

const ReportDetail: React.FC = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({ start: '2024-02-15', end: '2024-03-15' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: reports = [], isLoading: isReportLoading, error } = useSupabaseQuery<Report[]>(
    ['report', reportId],
    'reports',
    {
      match: { id: reportId },
      limit: 1
    }
  );

  const report = reports[0];

  const reportMutation = useSupabaseMutation<Report>(
    'reports',
    {
      onSuccess: () => {
        setIsEditModalOpen(false);
        toast.success('Report updated successfully');
      },
      onError: (error) => {
        console.error('Report update error:', error);
        toast.error('Failed to update report');
      }
    }
  );

  const handleEditReport = async (data: any) => {
    if (!report) return;

    try {
      setIsLoading(true);
      
      await reportMutation.mutateAsync({
        type: 'update',
        data: {
          id: report.id,
          ...data,
          last_updated: new Date().toISOString(),
          status: 'generating'
        }
      });

      // Simulate report regeneration
      setTimeout(async () => {
        await reportMutation.mutateAsync({
          type: 'update',
          data: { 
            id: report.id,
            status: 'ready'
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Edit report error:', error);
      toast.error('Failed to update report');
    } finally {
      setIsLoading(false);
    }
  };

  if (isReportLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-4">The requested report could not be found.</p>
          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <ReportHeader 
        report={report} 
        onEdit={() => setIsEditModalOpen(true)}
      />
      
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary">Performance Overview</h2>
          {report.enable_date_range && (
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={setDateRange}
            />
          )}
        </div>
        <ReportMetrics report={report} dateRange={dateRange} />
      </div>

      {report.platforms && report.platforms.length > 1 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-6">Performance Trends</h2>
            <ReportCharts report={report} dateRange={dateRange} type="trends" />
          </div>
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-6">Platform Distribution</h2>
            <ReportCharts report={report} dateRange={dateRange} type="distribution" />
          </div>
        </div>
      )}

      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Campaign Performance</h2>
        <ReportTable report={report} dateRange={dateRange} />
      </div>

      <EditReportModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditReport}
        report={report}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReportDetail;