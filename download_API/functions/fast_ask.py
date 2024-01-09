from concurrent.futures import ThreadPoolExecutor, as_completed

def status_getter(data):
    status = data.get("status")
    if not status:
        return False
    else:
        stat = str(status.get("statusCode"))
        if not stat or stat == "":
            return False
        elif str(stat) == "1":
            return False
        else:
            return True
        
def concurrent_api_with_timeout(timeout=120):
    def decorator(func):
        def wrapper(*args, **kwargs):
            with ThreadPoolExecutor() as executor:
                futures = [executor.submit(func, arg, timeout=timeout) for arg in args[0]]
                for f in as_completed(futures):
                    yield f.result()
        return wrapper
    return decorator