import React, { useState } from 'react';
import "./Announcement.css"

const Announcement = () => {
    const [readMore, setReadMore] = useState(false);

   const readMoreLessHandler = ()=>{
    setReadMore(!readMore)
   }

const socialMediaData = [
    {
        id: 1,
        image: "/Images/solution/whatsapp.svg",
        alt: "whatsapp" 
    },
    {
        id: 2,
        image: "/Images/solution/instagram.svg",
        alt: "instagram" 
    },
    {
        id: 3,
        image: "/Images/solution/facebook.svg",
        alt: "facebook" 
    },
    {
        id: 4,
        image: "/Images/solution/youtube.svg",
        alt: "youtube" 
    }
]

  return (
    <div className='announcement-main'>
        <img className='announcement-main-image' src="/Images/solution/anouncement.svg" alt="anouncement-img" />

        <div className='new-about-brand-wraper'>
            <h1>News About Brands</h1>
        </div>

        <div className='title-social-media-wraper'>
          <h1>We’re thrilled to announce our latest achievement, partnership, or service launch</h1>
          <div className='auther-date-wraper'>
            <p>By Anil Mahato</p>
            <p>Nov 28,2024</p>
          </div>
          <div className='social-media-wraper'>
            {
              socialMediaData.map((item, index)=>{
                return (
              <div className='social-media-icon-wraper' key={index}>
                 <img src={item.image} alt={item.alt} />
               </div>
                )}) 
            }
          </div>
        </div>

         <p className='para-text'>
            Lorem ipsum dolor sit amet consectetur. Sapien pharetra nunc dolor morbi purus turpis feugiat. Non sed diam nisl praesent blandit laoreet. Suscipit nunc donec accumsan nunc enim neque ultrices auctor aliquam. Cursus facilisi neque quis ornare. Lorem consectetur egestas dolor elementum. Aliquam diam tortor accumsan mattis donec turpis. Eleifend 
          </p>
          <div>
           <p className='para-text'>
             feugiat aliquet rhoncus sed tempor non risus magna. Mi condimentum eu diam nunc. Erat dignissim auctor adipiscing pretium odio. Felis a a eget turpis id. Placerat mauris mattis viverra sit vitae dictum pellentesque adipiscing. Tortor eget ridiculus arcu dignissim. Sapien sit vehicula ultricies eget enim neque arcu. In magnis semper etiam duis tristique sagittis eget arcu. Pulvinar fringilla bibendum posuere tortor. Porttitor cursus cursus.
            </p>

         {  readMore &&  <p className='para-text'>
             feugiat aliquet rhoncus sed tempor non risus magna. Mi condimentum eu diam nunc. Erat dignissim auctor adipiscing pretium odio. Felis a a eget turpis id. Placerat mauris mattis viverra sit vitae dictum pellentesque adipiscing. Tortor eget ridiculus arcu dignissim. Sapien sit vehicula ultricies eget enim neque arcu. In magnis semper etiam duis tristique sagittis eget arcu. Pulvinar fringilla bibendum posuere tortor. Porttitor cursus cursus.
            </p> 
            }

            <p 
              onClick={readMoreLessHandler}  
              className='read-more-text'>{ !readMore ?  "Read More...": "Read Less.."}
            </p>
          </div>
    </div>
  )
}

export default Announcement