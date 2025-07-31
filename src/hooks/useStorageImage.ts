
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStorageImage = (bucketName: string, fileName: string | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    attemptedUrls: string[];
    bucketExists: boolean;
    fileName: string | null;
  }>({
    attemptedUrls: [],
    bucketExists: false,
    fileName: null
  });

  useEffect(() => {
    if (!fileName || !bucketName) {
      setImageUrl(null);
      setDebugInfo({
        attemptedUrls: [],
        bucketExists: false,
        fileName: fileName
      });
      return;
    }

    const getImageUrl = async () => {
      setLoading(true);
      setError(null);
      const attemptedUrls: string[] = [];
      
      try {
        console.log('🔍 [useStorageImage] Starting image search:', {
          bucketName,
          fileName,
          timestamp: new Date().toISOString()
        });

        // Verificar si el bucket existe
        const { data: buckets, error: bucketsError } = await supabase.storage.getBucket(bucketName);
        
        console.log('📦 [useStorageImage] Bucket check:', {
          bucketName,
          bucketsError
        });

        // Intentar diferentes extensiones de archivo
        const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
        
        for (const ext of extensions) {
          const fullFileName = fileName.includes('.') ? fileName : `${fileName}.${ext}`;
          
          const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fullFileName);

          attemptedUrls.push(data.publicUrl);

          console.log('🔗 [useStorageImage] Trying URL:', {
            fileName: fullFileName,
            url: data.publicUrl
          });

          // Verificar si la imagen existe
          try {
            const response = await fetch(data.publicUrl, { 
              method: 'HEAD',
              cache: 'no-cache'
            });
            
            console.log('🌐 [useStorageImage] Response:', {
              fileName: fullFileName,
              status: response.status,
              ok: response.ok,
              contentType: response.headers.get('content-type')
            });

            if (response.ok) {
              console.log('✅ [useStorageImage] Image found!', {
                fileName: fullFileName,
                url: data.publicUrl
              });
              
              setImageUrl(data.publicUrl);
              setDebugInfo({
                attemptedUrls,
                bucketExists: true,
                fileName
              });
              setLoading(false);
              return;
            }
          } catch (fetchError) {
            console.log('❌ [useStorageImage] Fetch error:', {
              fileName: fullFileName,
              error: fetchError
            });
          }
        }
        
        // Si llegamos aquí, no se encontró ninguna imagen
        console.log('🚫 [useStorageImage] No image found after all attempts:', {
          fileName,
          attemptedUrls,
          totalAttempts: attemptedUrls.length
        });
        
        setError('Imagen no encontrada en ningún formato');
        setImageUrl(null);
        setDebugInfo({
          attemptedUrls,
          bucketExists: true,
          fileName
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error('💥 [useStorageImage] General error:', {
          error: err,
          fileName,
          bucketName
        });
        
        setError(`Error al cargar la imagen: ${errorMessage}`);
        setImageUrl(null);
        setDebugInfo({
          attemptedUrls,
          bucketExists: false,
          fileName
        });
      } finally {
        setLoading(false);
      }
    };

    getImageUrl();
  }, [bucketName, fileName]);

  return { imageUrl, loading, error, debugInfo };
};
