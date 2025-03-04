import React, { useRef, useState } from 'react';
import { X, Download, Share2, Check, Copy, Link } from 'lucide-react';
import { format } from 'date-fns';
import CertificateTemplate from './CertificateTemplate';

export default function CertificateModal({ certificate, user, onClose, onDownload }) {
  const modalRef = useRef(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Handle click outside to close
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle share button click
  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Handle share via navigator.share API (mobile devices)
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${certificate.eventName} Certificate`,
          text: `Check out my certificate for ${certificate.eventName}!`,
          url: window.location.href,
        });
        setShowShareOptions(false);
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    const certificateUrl = `${window.location.origin}/certificates?id=${certificate.id}`;
    navigator.clipboard.writeText(certificateUrl)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy link:', err));
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Certificate of Completion</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
              title="Download Certificate"
            >
              <Download className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                onClick={handleShareClick}
                className="flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                title="Share Certificate"
              >
                <Share2 className="h-5 w-5" />
              </button>
              
              {/* Share options dropdown */}
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                  {navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex justify-center">
          <CertificateTemplate 
            userName={user?.name || 'John Doe'}
            eventName={certificate.eventName}
            issueDate={certificate.issueDate}
            certificateId={certificate.id}
            issuer={certificate.issuer}
          />
        </div>
      </div>
    </div>
  );
}
