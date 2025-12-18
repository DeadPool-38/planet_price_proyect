# Install dependencies
pip install -r requirements.txt

# Run migrations to Supabase
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input