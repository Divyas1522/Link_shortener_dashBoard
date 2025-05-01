import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react';

const CreateLink = () => {

  const token = localStorage.getItem("token");

  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expireAt, setExpireAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!originalUrl) {
      setError('Please enter a valid URL');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/link/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl,
          ...(customAlias.trim() && { customAlias }),
          expireAt: expireAt || null,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log('Link created successfully:', data.shortUrl);
        setShortUrl(data.shortUrl);
        setOriginalUrl('');
        setCustomAlias('');
        setExpireAt('');
        setCopied(false);
        // navigate('/dashboard/links');
      } else {
        setError(data.message || 'Failed to create link');
      }
    }
    catch (err) {
      console.error('Error creating link:', err);
      setError('An error occurred while creating the link');
    }
    finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullShortUrl = `${import.meta.env.VITE_BASE_URL}/link/${shortUrl || customAlias}`
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
   const timeout =setTimeout(() => {
      setShow(true)
    }, 30 );
    return () => clearTimeout(timeout)
  },[])

  return (
    <div className="md:mt-2 flex items-center justify-center pt-10">
      <div className={`max-w-lg w-200 p-10 bg-[#1c1f2a] dark:bg-[#0f111a] rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out transform hover:bg-gray-950 ${show ? "scale-100 opacity-100" : "scale-70 opacity-0" } `}>
        <h2 className="text-3xl font-semibold mb-4 mt-[-15px] text-blue-300  ">Create Short Link</h2>

        <form onSubmit={handleCreateLink} className="space-y-4">
          <div>
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-300 mb-1">Original URL</label>
            <input
              type="url"
              id="originalUrl"
              className="w-full p-2 bg-[#2a2f3a] border border-[#3b444e] rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="customAlias" className="block text-sm font-medium text-gray-300 mb-1">Custom Alias (Optional)</label>
            <input
              type="text"
              id="customAlias"
              className="w-full p-1 bg-[#2a2f3a] border border-[#3b444e] rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="expireAt" className="block text-sm font-medium text-gray-300 mb-1">Expiration Date (Optional)</label>
            <input
              type="datetime-local"
              id="expireAt"
              className="w-full p-2 bg-[#2a2f3a] border border-[#3b444e] rounded-md text-white focus:ring-2 focus:ring-cyan-500"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className={`w-full p-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md ${loading ? 'opacity-50' : ''} hover:from-cyan-400 hover:to-purple-500 transition-all duration-300`}
            disabled={loading}
          >
            Create Link
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 border border-black rounded-lg bg-[#151821] hover:bg-[#1c1f2a] hover:border-blue-400 transition duration-300">
            <p className="text-purple-400 font-semibold ">Short URL created:</p>
            <div className="flex items-center justify-between mt-2">
              <a href={`${import.meta.env.VITE_BASE_URL}/link/${shortUrl || customAlias}`} target="_blank" className="text-cyan-400 break-all no-underline">{`${import.meta.env.VITE_BASE_URL}/link/${shortUrl || customAlias}`}</a>
              <button
                onClick={handleCopy}
                className="ml-4 mb-2 px-4 py-1 bg-cyan-600 hover:bg-emerald-600 rounded text-white text-sm"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="mt-2 flex flex-col items-center">
              <p className="text-gray-300 mb-2">Scan QR Code:</p>
              <QRCodeCanvas
                value={`${import.meta.env.VITE_BASE_URL}/link/${shortUrl}`}
                size={160}
                bgColor="black"
                fgColor="white"
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateLink