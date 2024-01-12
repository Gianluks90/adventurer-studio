class DataDeD:
    def __init__(self, name='', data_type='', data_text=None, width=0, height=0):
        self.name = name
        self.data_type = data_type
        self.x0 = 0
        self.y0 = 0
        self.page = 0
        self.text = data_text
        self.page_type = 'normal'
        self.font = "Arial"
        self.font_color = "black"
        self.font_style = "normal"
        if data_type in ['box', 'image']:
            self.width = width
            self.height = height

    def add_parameter(self, parameter, value):
        setattr(self, parameter, value)

    def __repr__(self):
        parameters = '\t'.join(f"{parameter} = {getattr(self, parameter)}" for parameter in self.__dict__.keys())
        return f"{self.name}: {parameters}"
