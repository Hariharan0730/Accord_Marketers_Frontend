import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"]
          ]
        }
      });

      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html);
      });
    }

    
    if (value && quillRef.current) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return <div ref={editorRef} />;
}