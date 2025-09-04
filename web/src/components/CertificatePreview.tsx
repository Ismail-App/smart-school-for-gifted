import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function CertificatePreview({ studentName, programName, certificateId }: { studentName: string; programName: string; certificateId: string }) {
  const [qr, setQr] = useState<string>("");
  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/verify/${certificateId}` : `https://example.com/verify/${certificateId}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { width: 240, margin: 1 }).then(setQr).catch(console.error);
  }, [verifyUrl]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-6">
        <div className="text-center">
          <div className="text-xs tracking-widest text-muted-foreground">Certificate of Achievement</div>
          <h3 className="mt-1 text-2xl font-bold">شهادة إتمام</h3>
          <div className="mt-2 text-sm text-muted-foreground">تمنح للسيد/ة</div>
          <div className="mt-1 text-xl font-semibold">{studentName}</div>
          <div className="mt-2">لاستكماله/ا بنجاح متطلبات مسار</div>
          <div className="mt-1 text-lg font-semibold text-primary">{programName}</div>
          <div className="mt-2 text-xs text-muted-foreground">معرّف الشهادة: {certificateId}</div>
          <div className="mt-4 flex items-center justify-center">
            {qr ? <img alt="QR" src={qr} className="h-40 w-40 rounded bg-white p-2 shadow" /> : <div>...</div>}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">التحقق: {verifyUrl}</div>
        </div>
      </div>
      {qr && (
        <div className="flex items-center justify-end">
          <a href={qr} download={`certificate-qr-${certificateId}.png`} className="rounded-md border px-3 py-2 text-sm">تحميل رمز QR</a>
        </div>
      )}
    </div>
  );
}
