"use client"
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useImageTransactions } from '@/hooks/useImageTransaction';
import { TransactionsResponse, Transaction } from '@/interfaces';

export default function ImageTransactions() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useImageTransactions();

  const [isIntersecting, setIsIntersecting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) return <div className="text-red-500">Error loading transactions</div>;

  return (
    <div className="bg-black text-green-500">
      <h1 className="font-mono text-xl italic mb-4 tracking-wider">
        <span className="text-green-400">&lt;</span>
        _arWeaVe<span className="text-green-300">ImageExplorer</span>_
        <span className="text-green-400">&gt;</span>
      </h1>
      <p className="font-mono text-sm mb-6 text-green-400">
        Explore the latest images stored on the Arweave network
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
        {isLoading ? (
          // Hacker-themed skeleton loader
          Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-green-900 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-green-500 font-mono text-sm animate-pulse">{`Loading_${index}`}</span>
              </div>
            </div>
          ))
        ) : (
          // Actual images with hacker theme
          data && data.pages.map((page: TransactionsResponse, pageIndex: number) => (
            page.edges.map(({ node }: { node: Transaction }) => (
              <div key={node.id} className="relative w-full aspect-square bg-gray-900 rounded-sm overflow-hidden group">
                <Image
                  src={`https://permagate.io/${node.id}`}
                  alt={`Transaction ${node.id}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-all duration-300 ease-in-out opacity-0 group-hover:scale-110"
                  onLoad={(event) => {
                    const img = event.target as HTMLImageElement;
                    img.classList.remove('opacity-0');
                    const skeleton = img.parentElement?.querySelector('.skeleton');
                    if (skeleton) {
                      skeleton.classList.add('hidden');
                    }
                  }}
                />
                <div className="skeleton absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-green-900 animate-pulse" />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-green-500 font-mono text-sm">{`ID: ${node.id}`}</span>
                </div>
              </div>
            ))
          ))
        )}
      </div>

      <div ref={bottomRef} className="h-10" />

      {isFetchingNextPage && (
        <div className="mt-4 text-center text-green-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <span className="ml-2 font-mono">Decrypting...</span>
        </div>
      )}
    </div>
  );
}
