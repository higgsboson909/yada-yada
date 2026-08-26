class NotFoundException(Exception):
    """Exception raised when an item is not found."""

    def __init__(
        self,
    ):
        # self.item_id = item_id
        self.message = f"Item  not found"
        super().__init__(self.message)
