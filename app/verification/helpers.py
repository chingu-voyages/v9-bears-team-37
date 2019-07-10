import random
import string

ALPHANUM = string.ascii_uppercase + string.digits[1:]


def generate_token(length=6):
    """ returns a six unique characters long randomly 
    sampled from alphanumerals containing 1-9 and all 
    the english letters in upper case."""
    return ''.join(random.sample(ALPHANUM, length))
