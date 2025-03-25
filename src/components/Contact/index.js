import { useEffect, useState } from 'react'
import { useRef } from 'react'

import emailjs from '@emailjs/browser'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import Loader from 'react-loaders'
import { ClipLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const Contact = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const form = useRef()
  const [loading, setLoading] = useState(false)
  const contactArray = 'Contact Me'.split('')

  useEffect(() => {
    setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
  }, [])

  const sendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)

    const email = form.current.email.value
    const res = await verifyEmail(email)
    if (!res) {
      setLoading(false)
      toast.error('Please enter a valid email address', {
        position: 'bottom-center',
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })
      return
    }

    let fullName = form.current.name.value
    let subject = form.current.subject.value
    let message = form.current.message.value

    let firstName = fullName.split(' ')[0]
    firstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()

    const templateParams = {
      firstname: firstName,
      name: fullName,
      subject: subject,
      message: message,
      email: email,
    }

    emailjs
      .send(
        process.env.REACT_APP_EMIAL_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        () => {
          toast.success('Message successfully sent!', {
            position: 'bottom-center',
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          })
          const timeout = setTimeout(() => {
            form.current.reset()
            setLoading(false)
          }, 3800)

          return () => clearTimeout(timeout)
        },
        () => {
          setLoading(false)
          toast.error('Failed to send the message, please try again', {
            position: 'bottom-center',
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          })
        }
      )
  }

  const verifyEmail = async (email) => {
    let res = await fetch(
      `https://mailok-email-validation.p.rapidapi.com/verify?email=${email}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST,
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        },
      }
    )

    let data = await res.json()
    return res.status === 200 && data.status === 'valid'
  }

  return (
    <>
      <div className="container contact-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={contactArray}
              idx={15}
            />
          </h1>
          <p>
            I’m open to new opportunities and collaborations! If you’re looking
            for someone who can bring fresh ideas and deliver impactful results,
            let’s get in touch!
          </p>

          <div className="contact-form">
            <form ref={form} onSubmit={sendEmail}>
              <ul>
                <li className="half">
                  <input placeholder="Name" type="text" name="name" required />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                    required
                  />
                </li>
                <li>
                  <textarea
                    placeholder="Message"
                    name="message"
                    required
                  ></textarea>
                </li>
                <li>
                  <button
                    type="submit"
                    className="flat-button"
                    disabled={loading}
                  >
                    {loading ? <ClipLoader color="#fff" size={20} /> : 'SEND'}
                  </button>
                </li>
              </ul>
              <ToastContainer />
            </form>
          </div>
        </div>
        <div className="map-wrap">
          <iframe
            title="University of Southern Philippines Foundation"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.847798679174!2d123.8984227!3d10.3285642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999245d95a295%3A0x1e3cfdb942e107f8!2sUniversity%20of%20Southern%20Philippines%20Foundation!5e0!3m2!1sen!2sph!4v1681234567890!5m2!1sen!2sph"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Contact
