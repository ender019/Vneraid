class Settings:
    imgPossible: bool = True
    videoPossible: bool = True
    voicePossible: bool = True
    linkPossible: bool = True

    def setParametr(self, par: str, val: bool) -> None:
        setattr(self, par+"Possible", val)