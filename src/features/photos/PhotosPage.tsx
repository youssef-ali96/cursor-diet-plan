import { useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { Camera, Upload, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useTrackingStore } from '@/store/trackingStore';
import { today } from '@/lib/utils';
import type { PhotoAngle } from '@/types';

export function PhotosPage() {
  const { progressPhotos, addPhoto, deletePhoto } = useTrackingStore();
  const [showUpload, setShowUpload] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIdx1, setCompareIdx1] = useState(0);
  const [compareIdx2, setCompareIdx2] = useState(Math.min(1, progressPhotos.length - 1));
  const fileRef = useRef<HTMLInputElement>(null);
  const [angle, setAngle] = useState<PhotoAngle>('front');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = () => {
    if (!previewUrl) return;
    addPhoto({
      date: today(),
      url: previewUrl,
      angle,
      notes,
    });
    setPreviewUrl(null);
    setNotes('');
    setShowUpload(false);
  };

  // Group by week
  const grouped = progressPhotos.reduce<Record<string, typeof progressPhotos>>((acc, photo) => {
    const week = format(parseISO(photo.date), "'Week of' MMM d, yyyy");
    if (!acc[week]) acc[week] = [];
    acc[week].push(photo);
    return acc;
  }, {});

  return (
    <AppLayout>
      <PageHeader
        title="Progress Photos"
        subtitle="Visualize your transformation journey"
        actions={
          <div className="flex gap-2">
            {progressPhotos.length >= 2 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCompareMode(true)}
              >
                Compare
              </Button>
            )}
            <Button size="sm" onClick={() => setShowUpload(true)} className="gap-1.5">
              <Camera size={14} /> Add Photo
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {progressPhotos.length === 0 ? (
          <EmptyState onAdd={() => setShowUpload(true)} />
        ) : (
          Object.entries(grouped).map(([week, photos]) => (
            <div key={week}>
              <h3 className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-3">{week}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1E1E23] border border-[#2A2A30]">
                    <img src={photo.url} alt={photo.angle} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-xs font-semibold text-white capitalize">{photo.angle}</p>
                      <p className="text-[10px] text-white/70">{format(parseISO(photo.date), 'MMM d, yyyy')}</p>
                    </div>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF4560]/80"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-black/50 text-white px-2 py-0.5 rounded-full">{photo.angle}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload modal */}
      <Modal open={showUpload} onClose={() => { setShowUpload(false); setPreviewUrl(null); }} title="Add Progress Photo" size="md">
        <div className="space-y-4">
          {!previewUrl ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-video border-2 border-dashed border-[#2A2A30] rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#C8FF00]/50 hover:bg-[#C8FF00]/5 transition-all"
            >
              <Upload size={32} className="text-[#4A4A5A]" />
              <p className="text-sm text-[#7A7A8C]">Click to upload photo</p>
              <p className="text-xs text-[#4A4A5A]">JPG, PNG, WEBP supported</p>
            </button>
          ) : (
            <div className="relative aspect-[3/4] max-h-64 rounded-2xl overflow-hidden">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#7A7A8C] uppercase tracking-wider">Photo Angle</p>
            <div className="flex gap-2">
              {(['front', 'side', 'back'] as PhotoAngle[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                    angle === a ? 'bg-[#C8FF00] text-[#0F0F11]' : 'bg-[#1E1E23] text-[#7A7A8C] border border-[#2A2A30]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Add notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-[#1E1E23] border border-[#2A2A30] rounded-xl p-3 text-sm text-[#F0F0F5] placeholder:text-[#4A4A5A] outline-none focus:border-[#C8FF00]/60 resize-none"
          />

          <Button onClick={handleUpload} disabled={!previewUrl} size="lg" className="w-full">
            <Upload size={16} /> Save Photo
          </Button>
        </div>
      </Modal>

      {/* Compare modal */}
      <Modal open={compareMode} onClose={() => setCompareMode(false)} title="Before & After" size="lg">
        {progressPhotos.length >= 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#C8FF00] uppercase tracking-wider text-center">Before</p>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1E1E23]">
                  <img src={progressPhotos[compareIdx1]?.url} alt="before" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-[#7A7A8C] text-center">
                  {progressPhotos[compareIdx1] && format(parseISO(progressPhotos[compareIdx1].date), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#30D158] uppercase tracking-wider text-center">After</p>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1E1E23]">
                  <img src={progressPhotos[compareIdx2]?.url} alt="after" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-[#7A7A8C] text-center">
                  {progressPhotos[compareIdx2] && format(parseISO(progressPhotos[compareIdx2].date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#C8FF00]/10 flex items-center justify-center mb-4">
        <Camera size={32} className="text-[#C8FF00]" />
      </div>
      <h3 className="text-lg font-bold text-[#F0F0F5] mb-2">Document Your Journey</h3>
      <p className="text-sm text-[#7A7A8C] max-w-xs mb-6">
        Upload progress photos every few days. The before/after comparison will show how far you've come.
      </p>
      <Button onClick={onAdd} size="lg" className="gap-2">
        <Upload size={16} /> Upload First Photo
      </Button>
    </div>
  );
}
