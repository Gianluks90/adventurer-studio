import os
from datetime import datetime, timedelta
from fpdf import FPDF
import requests
import threading as th
import gc
from PIL import Image
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

def write_txt_to_pdf_new(info_struct2 : dict, document : int = 1, page_order : list = [], urls=[], id : str = "temp", *args):
    '''This function writes the replacement values to the PDF

    Args:
        replacement (dict): dictionary with the replacement values
        document (int, optional): document number. Defaults to 1.
        urls (list, optional): list of urls. Defaults to [].
        id (str, optional): id of the run. Defaults to "temp".

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
    pdf = FPDF(orientation='P', format='A4', unit='mm')

    gc.collect()

    # For each image in the list of images to be used as background add a page to the PDF and write the data to the PDF for that page
    for i, kind, image in page_order:
        pop_elements = []
        print(i, ' ', image, ' ', '*'*200)
        if kind in ['normal', 'appendice']:
            add_page(pdf, image )
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
            # if image == 'error':
            #     error_attachement_new(pdf, i)           
            # else:
            #     formato = image.split('.')[-1]
            #     if formato == 'pdf':
            #         # merge_pdf_new(pdf, image, i)
            #         pass
            #     else:
            #         true_w, true_h = proportion_detector(image)
            #         orientation = 'L' if true_w > true_h else 'P'
            #         pdf.add_page(orientation=orientation)
            #         pdf.image(image, x=0, y=0, w=true_w, h=true_h)
            # os.remove(image)
            pass
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

def urlatore_new(urls, id):
    '''Download the files in the list of urls

    Args:
        urls (list): list of urls to download
        id (str): The ID of the run

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
        pdfl = FPDF(orientation='P', format='A4', unit='mm')
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

def write_to_pdf_p_handling(pdf, element):
    '''Write the text in the pdf

    Args:
        pdf (FPDF): The pdf to write in
        element (dict): The element to write in the pdf

    Returns:
        None
    '''
    # Ectraction of the text and the size of the font
    try:
        text = controll_text(element.text)
        # pdf write the text in the pdf within the constraints of the box alligned to the center adapted to the size of the text to the size of the box
        pdf.set_font("Arial", size=element.size)
        pdf.set_xy(element.x, element.y)
        pdf.multi_cell(w=element.widht_space, h=element.height_space, txt=text, border=0, align="C", fill=False)
        pdf.set_xy(0, 0)
    except Exception as e:
        print(e)
        print(element)
        print("\\"*50)

def write_to_pdf_p(pdf, element):
    try:
        text = controll_text(element.text)
        font_size = element.size
        pdf.set_font("Arial", size=font_size)

        # Calculate the height of the text with the current font size
        lines = pdf.multi_cell(w=element.widht_space, h=0, txt=text, border=0, align="C", fill=False, split_only=True)
        text_height = len(lines) * pdf.font_size * 0.352778 

        # Reduce the font size until the height of the text is less than or equal to the height of the box
        while text_height > element.height_space:
            font_size -= 1
            pdf.set_font("Arial", size=font_size)
            lines = pdf.multi_cell(w=element.widht_space, h=0, txt=text, border=0, align="C", fill=False, split_only=True)
            text_height = len(lines) * pdf.font_size * 0.352778 
            if font_size <= 1:
                break

        # Write the text into the box
        pdf.set_xy(element.x, element.y)
        pdf.multi_cell(w=element.widht_space, h=element.height_space, txt=text, border=0, align="C", fill=False)
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

def add_page(pdf, image):
    '''Add a new page to the pdf

    Args:
        pdf (FPDF): The pdf to add the page to
        image (str): The path of the background image to add to the pdf

    Returns:
        None
    '''
    pdf.add_page()
    pdf.image(image, 0, 0, 210, 297)
    pdf.set_font("Arial", size=12)
    pdf.set_xy(0, 0)

def controll_text(text: str):
    from types import NoneType
    if isinstance(text, list):
        text = " ".join(text)
    elif isinstance(text, NoneType):
        return [""], 1
    elif isinstance(text, int):
        text = str(text)
    elif isinstance(text, float):
        text = str(text)
    return text


def how_many_mm(text : str, size : int):
    '''This function returns the number of mm that the text will occupy in the pdf

    Args:
        text (str): The text to be written
        size (int): The size of the font

    Returns:
        int: The number of mm that the text will occupy in the pdf
    '''
    return len(text)*size/2.834645669291339

def text_manipulation(text : str, max_len : int, height: int, size : int = 12):
    '''This function takes a string and returns a list of strings
    This function takes a string and returns a list of strings
    If the string is less than max_len characters long, then it is returned as a list containing that string and the font size 12
    If the string is greater than max_len characters long but less then max_len2, then it is returned as a list containing the string and the font size 10
    
    Args:
        text (str): The string to be manipulated
        max_len (int): The maximum length of the string for the font 12
        max_height (int): The maximum height of the string for the font 12

    Returns:
        list of str: The manipulated string
        int: The font size
    '''
    text = controll_text(text)
    while how_many_mm(text, size) > max_len:
        size -= 1
    return [text], size

