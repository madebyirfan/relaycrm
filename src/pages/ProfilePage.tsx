'use client'

import { useEffect, useState } from 'react'
import { Input } from '../components/ui/input'
import { Button as CustomButton } from '../components/ui/button'
import { Button, Upload, message } from 'antd'
import { Card } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { getAuth, updateProfile, updatePassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import AvatarImage from '../assets/images/avatar.png'

export default function ProfilePage() {
  const auth = getAuth()
  const [user] = useAuthState(auth)
  const [uploading, setUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    address: '',
    avatar: '',
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      console.log(user)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setProfileData({
          name: data.name || '',
          email: user.email || '',
          phone: data.phone || '',
          role: data.role || '',
          address: data.address || '',
          avatar: data.avatar || '',
        })
      } else {
        setProfileData({
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          role: '',
          address: '',
          avatar: '',
        })
      }

      setLoading(false)
    }

    fetchProfile()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleAvatarUpload = async (file: File) => {
    if (!file || !auth.currentUser) return
    setUploading(true)

    try {
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await updateProfile(auth.currentUser, { photoURL: downloadURL })
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        { avatar: downloadURL },
        { merge: true }
      )

      setPreviewUrl(downloadURL)
      setProfileData((prev) => ({
        ...prev,
        avatar: downloadURL,
      }))

      message.success('Avatar uploaded successfully!')
    } catch (err) {
      console.error('Upload error:', err)
      message.error('Failed to upload avatar.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    try {
      await updateProfile(user, {
        displayName: profileData.name,
        photoURL: profileData.avatar,
      })

      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: profileData.name,
          phone: profileData.phone,
          role: profileData.role,
          address: profileData.address,
          avatar: profileData.avatar,
        },
        { merge: true }
      )

      if (newPassword.length >= 6) {
        await updatePassword(user, newPassword)
        alert('✅ Password updated successfully.')
      }

      alert('✅ Profile updated successfully.')
    } catch (error) {
      alert('❌ Error updating profile: ' + (error as any).message)
    }

    setSaving(false)
  }

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading profile...</div>
  }

  return (
    <div className="max-w-2xl mx-auto dark:bg-black min-h-screen transition-colors duration-300">
      <Card className="dark:bg-neutral-900 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold dark:text-white">Your Profile</h2>

          <div className="flex items-center gap-4">
            <img
              src={previewUrl || profileData.avatar || AvatarImage}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <Upload
              showUploadList={false}
              accept="image/*"
              beforeUpload={(file) => {
                const localUrl = URL.createObjectURL(file)
                setPreviewUrl(localUrl)
                handleAvatarUpload(file)
                return false
              }}
            >
              <Button loading={uploading} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload New Avatar'}
              </Button>
            </Upload>
          </div>

          <div>
            <Label className="dark:text-white">Name</Label>
            <Input 
              name="name" 
              value={profileData.name} 
              onChange={handleChange} 
              className="bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <Label className="dark:text-white">Email</Label>
            <Input
              value={profileData.email}
              readOnly
              className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="dark:text-white">Phone</Label>
            <Input 
              name="phone" 
              value={profileData.phone} 
              onChange={handleChange}
              className="bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" 
            />
          </div>

          <div>
            <Label className="dark:text-white">Role</Label>
            <Input
              name="role" 
              value={profileData.role} 
              onChange={handleChange}
              className="bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <Label className="dark:text-white">Address</Label>
            <Input 
              name="address" 
              value={profileData.address} 
              onChange={handleChange}
              className="bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" 
            />
          </div>

          <div>
            <Label className="dark:text-white">Change Password</Label>
            <Input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <CustomButton
            onClick={handleSave}
            disabled={saving}
            className="w-full dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </CustomButton>
        </div>
      </Card>
    </div>
  )
}
