"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import DragDropZone from "@/components/DragDropZone";

interface MintedNFT {
  id: string;
  name: string;
  imageUrl: string;
  mintAddress: string;
  timestamp: string;
}

export default function MintPage() {
  const { connected, publicKey } = useWallet();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const [mintStatus, setMintStatus] = useState<string | null>(null);

  const handleImageFile = useCallback((file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }, []);

  const handleMint = async () => {
    if (!connected || !publicKey || !imageFile || !nftName) {
      setMintStatus("ERROR: Missing required fields or wallet not connected");
      return;
    }

    setIsMinting(true);
    setMintStatus("INITIALIZING MINT SEQUENCE...");

    // Simulate minting process (in production, this would interact with Metaplex/Solana)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMintStatus("UPLOADING IMAGE TO ARWEAVE...");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setMintStatus("CREATING METADATA...");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMintStatus("MINTING NFT ON SOLANA...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock mint address
    const mockMintAddress = `${publicKey.toString().slice(0, 8)}...${Math.random().toString(36).substring(2, 10)}`;

    const newNFT: MintedNFT = {
      id: `nft-${mintedNFTs.length + 1}`,
      name: nftName,
      imageUrl: imagePreview!,
      mintAddress: mockMintAddress,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setMintedNFTs([newNFT, ...mintedNFTs]);
    setMintStatus("MINT COMPLETE!");
    setIsMinting(false);

    // Reset form
    setTimeout(() => {
      setImageFile(null);
      setImagePreview(null);
      setNftName("");
      setNftDescription("");
      setMintStatus(null);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 text-[#00ff00]/50 text-sm">{">"} NFT MINT STATION</div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Mint Form */}
        <div className="terminal-box p-4">
          <div className="text-[#ffb000] mb-4">{">"} WALLET STATUS</div>

          <div className="mb-4">
            <WalletMultiButton className="!bg-[#00ff00]/20 !border !border-[#00ff00] !text-[#00ff00] hover:!bg-[#00ff00]/30 !font-mono !text-sm !h-auto !py-2" />
          </div>

          {connected && publicKey && (
            <div className="text-xs text-[#00ff00]/50 mb-4 break-all">
              Connected: {publicKey.toString()}
            </div>
          )}

          <div className="text-[#ffb000] mb-3 mt-6">{">"} CREATE NFT</div>

          <div className="space-y-4">
            <div>
              <label className="text-[#00ff00]/50 text-xs block mb-1">IMAGE</label>
              <DragDropZone
                accept={["image/*"]}
                onFile={handleImageFile}
                label="DROP IMAGE FILE"
                sublabel="or click to browse (.png, .jpg, .gif)"
                preview={imagePreview}
                className="h-48"
              />
            </div>

            <div>
              <label className="text-[#00ff00]/50 text-xs block mb-1">NAME</label>
              <input
                type="text"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="w-full bg-black border border-[#00ff00]/30 p-2 text-[#00ff00] text-sm"
                placeholder="UTRA Achievement #1"
              />
            </div>

            <div>
              <label className="text-[#00ff00]/50 text-xs block mb-1">DESCRIPTION</label>
              <textarea
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                className="w-full bg-black border border-[#00ff00]/30 p-2 text-[#00ff00] text-sm h-20 resize-none"
                placeholder="Achievement unlocked for..."
              />
            </div>

            <button
              onClick={handleMint}
              disabled={!connected || !imageFile || !nftName || isMinting}
              className={`w-full border px-4 py-3 text-sm transition-all ${
                !connected || !imageFile || !nftName || isMinting
                  ? "bg-[#00ff00]/5 border-[#00ff00]/20 text-[#00ff00]/30 cursor-not-allowed"
                  : "bg-[#ffb000]/20 border-[#ffb000] text-[#ffb000] hover:bg-[#ffb000]/30"
              }`}
            >
              {isMinting ? "[MINTING...]" : "[MINT NFT]"}
            </button>

            {mintStatus && (
              <div className="terminal-box p-3 text-xs">
                <div className="text-[#ffb000] animate-pulse">{">"} {mintStatus}</div>
              </div>
            )}
          </div>
        </div>

        {/* Minted NFTs */}
        <div className="terminal-box p-4">
          <div className="text-[#ffb000] mb-4">{">"} MINTED NFTS [{mintedNFTs.length}]</div>

          {mintedNFTs.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-[#00ff00]/30 text-sm">
              <pre>
{`  ┌─────────────┐
  │  NO NFTS    │
  │  MINTED     │
  │  YET        │
  └─────────────┘`}
              </pre>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {mintedNFTs.map((nft) => (
                <div key={nft.id} className="border border-[#00ff00]/20 p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 border border-[#00ff00]/30 flex-shrink-0">
                      <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#ffb000] text-sm truncate">{nft.name}</div>
                      <div className="text-[#00ff00]/50 text-xs mt-1">{nft.timestamp}</div>
                      <div className="text-[#00ff00]/30 text-xs mt-1 truncate">
                        Mint: {nft.mintAddress}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#00ff00]/20 text-xs text-[#00ff00]/40">
            <div>{">"} Network: Solana Devnet</div>
            <div>{">"} Standard: Metaplex NFT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
