import React, { useState } from 'react'
import { useQuery } from 'react-query'
import api from '../services/authService'
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline'

function TemplateSelector({ onSelectTemplate, selectedCategory }) {
  const [showTemplates, setShowTemplates] = useState(false)

  const { data: templates } = useQuery(
    ['ticket-templates', selectedCategory],
    async () => {
      const params = selectedCategory ? { category: selectedCategory } : {}
      const response = await api.get('/ticket-templates', { params })
      return response.data.templates
    },
    { enabled: !!selectedCategory }
  )

  if (!selectedCategory || !templates?.length) return null

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setShowTemplates(!showTemplates)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        <DocumentTextIcon className="w-4 h-4 mr-1" />
        Use Template ({templates.length} available)
      </button>

      {showTemplates && (
        <div className="mt-3 border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Choose a Template</h4>
            <button
              type="button"
              onClick={() => setShowTemplates(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-3 bg-white rounded border hover:border-blue-300 cursor-pointer"
                onClick={() => {
                  onSelectTemplate(template)
                  setShowTemplates(false)
                }}
              >
                <h5 className="font-medium text-gray-900">{template.name}</h5>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span className="mr-3">Category: {template.category?.name}</span>
                  <span>Priority: {template.priority?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateSelector