'use client';

import Link from "next/link";
import { useLanguage, LanguageSelector } from "@/lib/LanguageContext";
import { getTranslation, getTranslationArray } from "@/lib/translations";

export default function Home() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getTranslation('appTitle', language) as string}
              </h1>
            </div>
            <div className="flex items-center">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12 mt-5">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {getTranslation('heroTitle', language) as string}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {getTranslation('heroSubtitle', language) as string}
            </p>
          </div>

          {/* Portal Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* MI Room Incharge Portal */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {getTranslation('miRoomTitle', language) as string}
              </h3>
              <p className="text-gray-600 mb-6">
                {getTranslation('miRoomDescription', language) as string}
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                {getTranslationArray('miRoomFeatures', language).map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <Link
                href="/mi-room/login"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {getTranslation('miRoomLogin', language) as string}
              </Link>
            </div>

            {/* Hospital Doctor Portal */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {getTranslation('doctorTitle', language) as string}
              </h3>
              <p className="text-gray-600 mb-6">
                {getTranslation('doctorDescription', language) as string}
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                {getTranslationArray('doctorFeatures', language).map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <Link
                href="/doctor/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {getTranslation('doctorLogin', language) as string}
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {getTranslation('systemBenefitsTitle', language) as string}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslation('reducedLoadTitle', language) as string}</h4>
                <p className="text-gray-600 text-sm">
                  {getTranslation('reducedLoadDesc', language) as string}
                </p>
              </div>
              <div>
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslation('improvedAccessTitle', language) as string}</h4>
                <p className="text-gray-600 text-sm">
                  {getTranslation('improvedAccessDesc', language) as string}
                </p>
              </div>
              <div>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslation('efficientTriageTitle', language) as string}</h4>
                <p className="text-gray-600 text-sm">
                  {getTranslation('efficientTriageDesc', language) as string}
                </p>
              </div>
            </div>
          </div>

          {/* Village Awareness Message */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{getTranslation('villageAwarenessTitle', language) as string}</h3>
              <p className="text-lg mb-4 opacity-95">
                {getTranslation('villageAwarenessSubtitle', language) as string}
              </p>
              <p className="text-base mb-6 opacity-90 max-w-2xl mx-auto">
                {getTranslation('villageAwarenessDesc', language) as string}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('freeCheckups', language) as string}
                </span>
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('expertDoctors', language) as string}
                </span>
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('villageLocation', language) as string}
                </span>
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('saveMoneyTime', language) as string}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              {getTranslation('footerText', language) as string}
            </p>
            <Link
              href="/demo"
              className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {getTranslation('demoInstructions', language) as string}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}