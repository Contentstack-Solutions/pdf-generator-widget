/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { TypeSDKData, TypeEntryData } from "../../common/types";
import axios from 'axios'
/* Import our modules */
import "./styles.scss";

import PdfWidget from "./pdfWidget";

const SidebarWidget: React.FC = function () {
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "" });

  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

 

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const config = await appSdk?.getConfig();
      var config1: any = {
        method: 'get',
        url: `https://api.contentstack.io/v3/content_types/product_listing/entries?include[]=products_listing.reference_product.product`,
        headers: { 
          'api_key': 'bltafc77b6da64d7b0c', 
          'authorization': 'cs54893cf38a5192d76df3723b',
          'Content-Type': 'application/json'
        }
      };
      let response = await axios(config1)
      let data = response.data.entries[0]
      setEntryData(data); // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.

      setState({
        config,
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
  }, []);

  return (
    <div className="layout-container">
        {entryData.title && <PdfWidget entryData={entryData}/>}
    </div>
  );
};



export default SidebarWidget;


