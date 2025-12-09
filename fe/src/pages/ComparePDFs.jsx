import { useState } from "react";
import { BACKEND_URL } from "../config.js";

export default function ComparePDFs() {
  const [pdfUrls, setPdfUrls] = useState("");
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    setError("");

    try {
      let res;

      if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
        res = await fetch(`${BACKEND_URL}/compare-pdfs`, {
          method: "POST",
          body: formData,
        });
      } else if (pdfUrls) {
        const urls = pdfUrls
          .split("\n")
          .map((u) => u.trim())
          .filter((u) => u.length > 0);

        res = await fetch(`${BACKEND_URL}/compare-pdfs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdf_urls: urls }),
        });
      } else {
        alert("Provide PDF URLs or upload files");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setResult(data.result || JSON.stringify(data, null, 2));
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Compare PDFs</h2>

      <div className="bg-transparent p-4 rounded-lg mb-4 border border-gray-200/20">
        <label className="block text-sm font-medium text-gray-700 mb-2">Paste PDF URLs (one per line)</label>
        <textarea
          className="border p-3 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="https://example.com/doc1.pdf\nhttps://example.com/doc2.pdf"
          value={pdfUrls}
          onChange={(e) => setPdfUrls(e.target.value)}
          rows={4}
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Or upload PDF files</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 mb-3 w-full rounded"
        />

        <div className="flex items-center gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span>
                Comparing<span className="inline-block ml-2 cursor">&nbsp;</span>
              </span>
            ) : (
              "Compare PDFs"
            )}
          </button>
          <div className="text-sm text-gray-500">Tip: paste two or more PDF URLs or upload files</div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 p-3 border mb-3 bg-red-50 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-4 p-4 border bg-transparent whitespace-pre-wrap rounded-lg">
          <strong className="block mb-2">Result:</strong>
          <pre className="text-sm overflow-auto max-h-72">{result}</pre>
        </div>
      )}
    </div>
  );
}
