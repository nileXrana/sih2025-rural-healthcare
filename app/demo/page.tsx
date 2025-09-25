export default function DemoInstructions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🏥 Healthcare Hub-and-Spoke System Demo
            </h1>
            <p className="text-lg text-gray-600">
              Quick guide to test the prototype system
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                MI Room Incharge Portal
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-green-700">Demo Login:</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> Any email (e.g., incharge@demo.com)<br/>
                    <strong>Password:</strong> Any password
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-green-700">What you can do:</h3>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Register new patients</li>
                    <li>View patient list</li>
                    <li>Create consultation requests</li>
                    <li>Track consultation status</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                Hospital Doctor Portal
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-blue-700">Demo Login:</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> Any email (e.g., doctor@demo.com)<br/>
                    <strong>Password:</strong> Any password
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-blue-700">What you can do:</h3>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>View consultation queue</li>
                    <li>Accept consultation requests</li>
                    <li>Review patient history</li>
                    <li>Manage active consultations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How to Test the Full Workflow
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li><strong>Login as MI Room Incharge:</strong> Use any email and password to access the incharge portal</li>
              <li><strong>Register a Patient:</strong> Go to "Register Patient" tab and add a new patient with sample data</li>
              <li><strong>Create Consultation:</strong> Start a consultation request for the patient (feature in development)</li>
              <li><strong>Login as Doctor:</strong> Open another browser tab and login as a doctor</li>
              <li><strong>Review Queue:</strong> Check the consultation queue and accept pending requests</li>
              <li><strong>Complete Workflow:</strong> Manage the consultation from both portals</li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              📊 Sample Data Available
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              The system comes pre-loaded with sample data for testing:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-700">Pre-registered Users:</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• incharge1@miroom.com</li>
                  <li>• incharge2@miroom.com</li>
                  <li>• doctor1@hospital.com</li>
                  <li>• doctor2@hospital.com</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Sample Data:</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• 3 registered patients</li>
                  <li>• 2 MI Rooms (Nabha, Rajpura)</li>
                  <li>• 2 pending consultations</li>
                  <li>• Complete medical profiles</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🏠 Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}