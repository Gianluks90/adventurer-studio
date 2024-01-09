import os
from datetime import datetime, timedelta
from fpdf import FPDF
import requests
import threading as th
import gc
from PIL import Image
#import pypdfium2 as pdfium
from .dat_object import DataDeD

MAXNUMBER = 30

def check_file():
    lain = []
    if not os.path.exists("done.txt"):
        with open("done.txt", "w") as f:
            f.write("")
    else:
        with open('done.txt', 'r') as f:
            content = f.readlines()
        if content:
            for line in content:
                try:
                    line = line.replace('\n', '')
                    date, file = line.split('-')
                    date = datetime.strptime(date, "%d/%m/%Y %H:%M:%S")
                    if datetime.now() - date > timedelta(minutes=5):
                        os.remove(file.replace('\n', ''))
                        print('removed ', line)
                    else:
                        lain.append(line)
                except:
                    print('not found ', line)
            del content
        with open('done.txt', 'w') as f:
            f.write('')
            for line in lain:
                f.write(line+ '\n')
    del lain

def write_txt_to_pdf_new(info_struct2 : dict, document : int = 1, page_order : list = [], urls=[], id : str = "temp", status : bool = False):
    '''This function writes the replacement values to the PDF

    Args:
        replacement (dict): dictionary with the replacement values
        document (int, optional): document number. Defaults to 1.
        urls (list, optional): list of urls. Defaults to [].
        id (str, optional): id of the run. Defaults to "temp".
        status (bool, optional): status of the run. Defaults to False. It means It is a BOZZA

    Returns:
        pdf_path (str): path of the PDF to download
    '''
    # if len(urls) > 0:
    #     urlatore_new(urls, id)

    # Set the path of the PDF
    pdf_path = id + '.pdf'
    # Check and delete old files
    check_file()

    print('*'*50)
    # Create the PDF
    pdf = FPDF(orientation='L', format='A4', unit='mm')

    gc.collect()

    # For each image in the list of images to be used as background add a page to the PDF and write the data to the PDF for that page
    for i, kind, image in page_order:
        pop_elements = []
        print(i, ' ', image, ' ', '*'*200)
        # Add a page to the PDF
        if kind == 'pre-allegato':
            add_interpausa(pdf, i, status, image)
        elif kind in ['normal', 'appendice']:
            add_page(pdf, image, status)
            # For each key in the dictionary with the data text and position in the PDF extract the data for that page and write it to the PDF
            for element in info_struct2:
                # If the page number of the data is the same as the page number of the image add the data to the PDF
                if element.page == i and element.page_type == kind:
                # If the data is a image write the image to the PDF
                    if element.data_type == 'image':
                        true_w, true_h = proportion_detector(element)
                        pdf.image(element.text, x=element.x, y=element.y, w=true_w, h=true_h)
                        os.remove(element.text)
                    # If the data is a text write the text to the PDF
                    elif element.data_type == 'text':
                        write_to_pdf_p(pdf, element)
                    elif element.data_type == 'box':
                        write_box(pdf, element)
                    else:
                        print("type not found")
                    pop_elements.append(element)
            for element in pop_elements:
                info_struct2.remove(element)      
                # add used data to the list of used data
        elif kind == 'allegato':
            if image == 'error':
                error_attachement_new(pdf, i)           
            else:
                formato = image.split('.')[-1]
                if formato == 'pdf':
                    # merge_pdf_new(pdf, image, i)
                    pass
                else:
                    true_w, true_h = proportion_detector(image)
                    orientation = 'L' if true_w > true_h else 'P'
                    pdf.add_page(orientation=orientation)
                    pdf.image(image, x=0, y=0, w=true_w, h=true_h)
            os.remove(image)
        elif kind == "lista/allegati":
            add_lista_allegati(pdf, i, image)
        elif kind == "appendice_listonespeciale":
            numbers = 0
            changer = 0
            base_name = ""
            for element in info_struct2:
                if element.page == i and element.page_type == kind:
                    numbers, base_name, changer = listone_speciale(pdf, element, numbers, base_name, changer)
        gc.collect()

    # Write the PDF to the file
    pdf.output(pdf_path)

    with open('done.txt', 'a') as f:
        time = datetime.now()
        f.write(time.strftime("%d/%m/%Y %H:%M:%S")+'-'+pdf_path+'\n')

    return pdf_path

def listone_speciale(pdf, element, numbers, base_name_old, changer):
    base_name_new = element.name
    if numbers == 0:
        pdf.add_page()
    if base_name_old != base_name_new:
        pdf.set_font('Arial', 'B', 15)
        pdf.set_xy(10, 10+numbers*3 + changer)
        pdf.cell(0, 0, base_name_new)
        pdf.set_xy(0,0)
        changer += 7

    pdf.set_font('Arial', '', 10)
    pdf.set_xy(10, 10+numbers*3 + changer)
    numbers = numbers + 1 if numbers < MAXNUMBER else 0

    pdf.cell(0, 0, element.text)
    pdf.set_xy(0,0)
    return numbers, base_name_new, changer

def proportion_detector(element, max_w=297, max_h=297):
    if isinstance(element, DataDeD):
        max_w = element.max_w
        max_h = element.max_h
        w = element.w
        h = element.h
        ratio = w/h
        if ratio < 1:
            true_w = max_w
            true_h = max_w/ratio
        else:
            true_h = max_h
            true_w = max_h*ratio
        return true_w, true_h
    else:
        image = Image.open(element)
        w, h = image.size
        ratio = w/h
        if ratio > 1:
            true_w = max_w
            true_h = max_w/ratio
            if true_h >= 210:
                true_h = 210
                true_w = 210*ratio
        else:
            true_h = max_h
            true_w = max_h*ratio
            if true_w >= 210:
                true_w = 210
                true_h = 210/ratio
        print(true_w, true_h)
        return true_w, true_h

def add_lista_allegati(pdf, i, lista_allegati):
    print(lista_allegati)
    pdf.add_page(orientation='P')
    pdf.set_font("Arial", size=30)
    pdf.set_xy(10,10)
    pdf.cell(w=0, h=0, txt='Lista Allegati', border=0, ln=1, align="L", fill=False)
    pdf.set_font("Arial", size=15)
    for j, allegato in enumerate(lista_allegati):
        pdf.set_xy(10, 30+j*10)
        pdf.cell(w=0, h=0, txt=str((j+1)+i*23), border=0, ln=1, align="L", fill=False)
        pdf.set_xy(20, 30+j*10)
        try:
            pdf.cell(w=0, h=0, txt=allegato, border=0, ln=1, align="L", fill=False)
        except Exception as e:
            pdf.cell(w=0, h=0, txt='error', border=0, ln=1, align="L", fill=False)
            print('error')
            print(e)
            print(allegato)
            print("\\"*50)

def add_interpausa(pdf, i, status, name_file = ''):
    pdf.add_page() 

    if not status:
        print('adding bozza')
        pdf.image('./app/templates/BOZZA.png', 0, 0, 297, 210)
        print('added bozza')
    print('+'*200)
    line = f'Attachment {i}:'
    pdf.set_font("Arial", size=30)
    pdf.set_xy(50, 50)
    pdf.cell(w=0, h=0, txt=line, border=0, ln=1, align="L", fill=False)
    pdf.set_font("Arial", size=20)
    pdf.set_xy(50, 70)
    pdf.cell(w=0, h=0, txt=name_file, border=0, ln=1, align="L", fill=False)

# def merge_pdf_new(pdf : FPDF, base : str, i: int):
#     '''Merge all the pdfs in the list of urls in a single pdf

#     Args:
#         pdf_path (str): The path of the pdf to merge
#         urls (list): The list of urls to merge
#         id (str): The ID of the run

#     Returns:
#         None
#     '''

#     pages = []
#     if os.path.exists(base):
#         pdfx = pdfium.PdfDocument(base)
#         n_pages = len(pdfx)
#         page_indices = [i for i in range(n_pages)]  # all pages
#         renderer = pdfx.render(
#             pdfium.PdfBitmap.to_pil,
#             page_indices = page_indices,
#             scale = 300/72,  # 300dpi resolution
#             )
#         for i, image in zip(page_indices, renderer):
#             image.save("out_image_{}.png".format(i))
#             orientation = 'P' if image.size[0] < image.size[1] else 'L'
#             pages.append(("out_image_{}.png".format(i), orientation))

        
#         try:
#             for baseim, orient in pages:
#                 # add a page to the pdf
#                 pdf.add_page(orientation=orient)
#                 # write the image to the pdf
#                 if orient == 'L':
#                     pdf.image(baseim, 0, 0, 210, 297)
#                 elif orient == 'P':
#                     pdf.image(baseim, 0, 0, 297, 210)
#                 os.remove(baseim)
#             #pdf.image(base, 0, 0, 297, 210, type='L')
#         except Exception as e:
#             print(e)
#             error_attachement_new(pdf, i*1000)
    
#     else:
#         print('no base', base)
#         error_attachement_new(pdf, i*1000)

def urlatore_new(urls, id):
    '''Download the files in the list of urls

    Args:
        urls (list): list of urls to download
        id (str): The ID of the run
        status (str): The status of the run. For the bozza option

    Returns:
        None
    '''
    # This is a list comprehension that creates a thread for every link in the list
    threads = [th.Thread(target=download, args=(urls[i], id, i)) for i in range(len(urls))]
    for thread in threads:
        # This loop starts every thread
        thread.start()
    for thread in threads:
        # This loop waits for every thread to finish before continuing
        thread.join()

def download(url, id, i):
    '''Download the given URL and save it to disk
    
    Args:
        url (str): The URL to download
        id (str): The ID of the run
        i (int): The number of he position in the allegati list

    Returns:
        None

    '''
    print('attesa:', i, url)
    r = requests.get(url)
    print('fine request:', i, url)
    if r.status_code == 200:
        try:
            formato = url.split(".")[-1].split("?")[0]
            print('Saving:', i, formato, url)
            with open(f"{id}_{i}_temp.{formato}", "wb") as code:
                code.write(r.content)
            print('SAVED')
        except Exception as e:
            print(e)
            print('Error with the saving of the file')
            print("\\"*50)
    else:
        print('Error:', i, url)
    del r
    gc.collect()

def image_to_pdf(i, formato, id):
    '''Convert the image to a pdf
    
    Args:
        i (int): The number of the allegato
        formato (str): The format of the image
        id (str): The ID of the run

    Returns:
        None
    '''
    try:
        pdfl = FPDF(orientation='L', format='A4', unit='mm')
        pdfl.add_page()
        pdfl.image(f"{id}_{i}_temp.{formato}", x=0, y=0, w=210, h=297)
        pdfl.output(f"{id}_{i}_temp.pdf", "F")
        pdfl.close()
        del pdfl
        gc.collect()
        os.remove(f"{id}_{i}_temp.{formato}")
    except Exception as e:
        print(e)
        print('Error with the image to pdf conversion')
        print("\\"*50)

def error_attachement_new(pdf, i):
    '''Create a new pdf with the error message to put before the allegato itself in the final pdf
    
    Args:
        i (int): The number of the allegato
        id (str): The ID of the run
        
    Returns:
        None
    '''
    line = f'Error with the attachement {i+1}'
            #create a new pdf
    pdf.add_page() 
    pdf.set_font("Arial", size=30)
    pdf.set_xy(50, 50)
    pdf.cell(w=0, h=0, txt=line, border=0, ln=1, align="L", fill=False)
    gc.collect()

def write_to_pdf_p(pdf, element):
    '''Write the text in the pdf

    Args:
        pdf (FPDF): The pdf to write in
        element (dict): The element to write in the pdf

    Returns:
        None
    '''
    # Ectraction of the text and the size of the font
    try:
        to_write, size = text_manipulation(element.text, element.max_len, acc = element.accapo, max_len2 = element.max_len2, max_righe = element.max_righe)
        pdf.set_font("Arial", size=size)
        # Write the text in the pdf
        for l, line in enumerate(to_write):   
            if element.y +l*3 > 189.9:
                pdf.set_xy(element.y, 189.9)     
            else:           
                pdf.set_xy(element.x, element.y+l*3)
            pdf.cell(w=0, h=0, txt=line, border=0, ln=1, align="L", fill=False)
            pdf.set_xy(0, 0)
    except Exception as e:
        print(e)
        print(element)
        print("\\"*50)

def write_box(pdf, element):
    '''Write the text in the pdf

    Args:
        pdf (FPDF): The pdf to write in
        element (dict): The element to write in the pdf

    Returns:
        None
    '''
    # Ectraction of the text and the size of the font
    try:
        to_write = element.text
        size = 12
        if to_write == 'X':
            pdf.set_font("Arial", size=size)
            # Write the text in the pdf
            if element.y > 189.9:
                pdf.set_xy(element.x, 189.9)     
            else:           
                pdf.set_xy(element.x, element.y)
            pdf.cell(w=0, h=0, txt=to_write, border=0, ln=1, align="L", fill=False)
            pdf.set_xy(0, 0)
        del to_write
        del size
    except Exception as e:
        print(e)
        print(element)
        print("\\"*50)

def add_page(pdf, image, status):
    '''Add a new page to the pdf

    Args:
        pdf (FPDF): The pdf to add the page to
        image (str): The path of the background image to add to the pdf
        status (bool): The status of the document if False the BOZZA image will be added to the pdf

    Returns:
        None
    '''
    pdf.add_page()
    if not status:
        print(image)
        pdf.image(image, 0, 0, 297, 210)
        pdf.image('./app/templates/BOZZA.png', 0, 0,  297, 210)
    else:
        image = image.replace(".jpg", "_y.jpg")
        pdf.image(image, 0, 0, 297, 210)

    pdf.set_font("Arial", size=12)
    pdf.set_xy(0, 0)


def text_manipulation(text : str, max_len : int, acc : bool, max_len2 : int = 0, max_righe : int = 0):
    '''This function takes a string and returns a list of strings
    This function takes a string and returns a list of strings
    If the string is less than max_len characters long, then it is returned as a list containing that string and the font size 12
    If the string is greater than max_len characters long but less then max_len2, then it is returned as a list containing the string and the font size 10
    If the string is greater than max_len2 characters long and not acc, then it is returned as a list containing the first max_len2 character of the string and the font size 10
    If the string is greater than max_len2 characters long and acc and less then max_len2*max_righe, then it is returned as a list containing the string split into max_len2 character long strings and the font size 10
    If the string is greater than max_len2 characters long and acc and greater then max_len2*max_righe, then it is returned as a list containing the string split into max_righe max_len2 character long strings and the font size 10
    
    Args:
        text (str): The string to be manipulated
        max_len (int): The maximum length of the string for the font 12
        acc (bool): If the string can be split into multiple lines
        max_len2 (int, optional): The maximum length of the string for the font 10
        max_righe (int, optional): The maximum number of lines for the font 10

    Returns:
        list of str: The manipulated string
        int: The font size
    '''
    from types import NoneType
    if isinstance(text, list):
        text = " ".join(text)
    elif isinstance(text, NoneType):
        return [""], 12
    elif isinstance(text, int):
        text = str(text)
    elif isinstance(text, float):
        text = str(text)
    if max_len is None or len(text) <= max_len:
        return [text], 12
    if not acc:
        return ([text[:max_len2]], 10) if len(text) >= max_len2 else ([text], 10)
    crop = len(text)// max_len
    if crop < max_righe:
        texts = [text[i*max_len:(i+1)*max_len] for i in range(crop)]
        texts.append(text[crop*max_len:])
        return texts, 12
    elif crop == max_righe:
        texts = [text[i*max_len:(i+1)*max_len] for i in range(crop)]
        return texts, 12
    else:
        crop2 = len(text)// max_len2
        if crop2 < max_righe:
            texts = [text[i*max_len2:(i+1)*max_len2] for i in range(crop2)]
            texts.append(text[crop2*max_len2:])
        elif crop2 == max_righe:
            texts = [text[i*max_len2:(i+1)*max_len2] for i in range(crop2)]
        else:
            texts = [text[i*max_len2:(i+1)*max_len2] for i in range(max_righe)]
        return texts, 10
