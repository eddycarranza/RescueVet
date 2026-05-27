import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PetForm from '../components/pets/PetForm'
import Layout from '../components/ui/Layout'

export default function EditPetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('pets').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) navigate('/dashboard')
      setPet(data)
      setLoading(false)
    })
  }, [id, navigate])

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">🐾</div>
      </div>
    </Layout>
  )

  return <PetForm pet={pet} />
}
