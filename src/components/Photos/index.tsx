"use client";

import { useEffect, useState } from "react";
import useWeb5, { useDID, useProfile } from "../utils/hooks";
import UploadPhoto from "./upload"
import style from "./style.module.scss";
import EmptyState from "../reusable/EmptyState";

export default function Photos() {
  const did = useDID();
  const { web5 } = useWeb5();
  const [photos, setPhotos] = useState<any>();

  const retrievePhotos = async () => {
    try {
      // @ts-ignore

      const photoList: any[] = [];

      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: "http://example.com/vaulthub-imagess",
            dataFormat: "application/json",
          },
        },
      });

      if (records) {
        let recordId = records.map((record: any) => {
          return record.id;
        });

        for (let i = 0; i < recordId.length; i++) {
          let { record } = await web5.dwn.records.read({
            message: {
              filter: {
                recordId: recordId[i],
              },
            },
          });
          const data = await record.data.json();
          photoList.push(data);
        }
        setPhotos(photoList);
      }
    } catch (error) {
      console.log("Error retrieving data from DWN:", error);
    }
  };

  useEffect(() => {
    retrievePhotos();
  }, [web5]);

  return (
    <div>
      <>
        <UploadPhoto />
        {!photos || photos.length < 0 ? (
          <EmptyState
            imgSrc="/images/gallery.svg"
            infoText="You have not added any photos yet."
            btnValue="Upload"
          />
        ) : (
          <div className={style.photosWrapper}>
            {photos.map((photo: any, index: number) => (
              <div key={index} className={style.photo}>
                {photo.image ? <img alt="" src={photo.image} /> : null}
              </div>
            ))}
          </div>
        )}
      </>
    </div>
  );
}
