
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Tables } from '@/integrations/supabase/types';

type MedicalAnalysis = Tables<'medical_analyses'>;

export const useMedicalAnalyses = () => {
  const [analyses, setAnalyses] = useState<MedicalAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    } else {
      setAnalyses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analysis history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async (
    category: string,
    fileName: string,
    analysisResult: any,
    confidenceScore?: number,
    responseLanguage: 'en' | 'ar' = 'en',
    fileUrl?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('medical_analyses')
        .insert({
          user_id: user.id,
          analysis_type: category,
          file_name: fileName,
          file_type: 'image',
          analysis_result: {
            analysis: analysisResult,
            confidence: confidenceScore,
            file_url: fileUrl,
            response_language: responseLanguage
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setAnalyses(prev => [data, ...prev]);

      toast({
        title: 'Analysis Saved',
        description: 'Your medical analysis has been saved to your history.',
      });

      return data;
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save analysis to database',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));

      toast({
        title: 'Analysis Deleted',
        description: 'Analysis has been removed from your history.',
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete analysis',
        variant: 'destructive',
      });
    }
  };

  return {
    analyses,
    loading,
    saveAnalysis,
    deleteAnalysis,
    refetch: fetchAnalyses,
  };
};
