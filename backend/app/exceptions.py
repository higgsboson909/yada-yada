class NotFoundException(Exception):
    """Exception raised when an item is not found."""

    def __init__(self, item_id: int):
        # self.item_id = item_id
        self.message = f"Item with id {item_id} not found"
        super().__init__(self.message)
