"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/interpretations");
        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setInterpretations(data);
      } catch (error) {
        console.log("Error: ", error);
        setError("Failed to fetch interpretations, try reloading the page");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`api/interpretations/${id}`, { method: "DELETE" });
      setInterpretations((prevInterpretation) =>
        prevInterpretation?.filter((i) => i.$id !== id)
      );
    } catch (error) {
      setError("Failed to delete the post, try again.");
    }
  };
  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading interpretations...</p>
      ) : interpretations?.length > 0 ? (
        <div>
          {interpretations?.map((item) => (
            <div
              className="p-4 my-2 rounded-md border-b leading-8"
              key={item.$id}
            >
              <div className="font-bold">{item.term}</div>
              <div>{item.interpretation}</div>

              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  href={`/edit/${item.$id}`}
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Edit
                </Link>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  onClick={() => handleDelete(item.$id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No interpretations found.</p>
      )}
    </div>
  );
}
