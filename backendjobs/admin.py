from flask import current_app as app
from flask import make_response
import csv
import io
from backendjobs.tasks import user_triggered_async_job

@app.route('/get/report/data', methods=['GET'])
def get_report():
    job = user_triggered_async_job.delay()
    result=job.get()
    return result, 200

@app.route('/get/report/download', methods=['GET'])
def download_report():
    with open('product_report.csv', 'r') as file:
        csv_reader = csv.reader(file)
        csv_data = list(csv_reader)
        csv_buffer = io.StringIO()
        csv_writer = csv.writer(csv_buffer)
        csv_writer.writerows(csv_data)
        print(csv_buffer.getvalue())
    response = make_response(csv_buffer.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=report.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response