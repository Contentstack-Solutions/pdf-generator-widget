# PDF Generator Widget for Contentstack Developer Hub

This repository contains code for a PDF generator widget designed to be integrated into the Contentstack Developer Hub as a sidebar widget.

## Overview

The PDF generator widget allows users to generate PDF documents directly from Contentstack entries within the Developer Hub interface.

## Installation

To install and use the PDF generator widget:

1. Create a sidebar widget in the Contentstack Developer Hub.
2. Deploy the provided code to any hosting platform. Ensure to add the URL of the deployed application to the "App URL" field of the sidebar widget configuration.
3. Install the app into your Contentstack stack.
4. Navigate to the entry in Contentstack and open the sidebar to view the PDF generator widget.
5. To add more fields to the dropdown menu, modify the `handlePdfTemplate` function inside the `ui/src/container/pdfWidget.tsx` file by adding new cases for each field.

## Usage

Once the PDF generator widget is installed and configured, users can select the desired fields from the dropdown menu within the sidebar widget to generate a PDF document based on the selected template.
