export const CATEGORIES = ['Running', 'Basketball', 'Lifestyle', 'Skateboarding', 'Training'];

// retailPriceK is in THOUSANDS of VND: 189 -> "189,000 VND"
export const formatVnd = (priceK) => `${(Number(priceK) * 1000).toLocaleString('en-US')} VND`;

// Task 2: descending alphabetical order by sneakerName
export const byNameDesc = (a, b) => b.sneakerName.localeCompare(a.sneakerName);

// Task 3: ascending by id. mockapi returns id as a STRING ("1", "2", ..., "10"),
// so compare as numbers — a string sort would put "10" before "2".
export const byIdAsc = (a, b) => Number(a.id) - Number(b.id);

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Returns { field: message } — an empty object means the form is valid.
export function validateSneaker(form) {
  const errors = {};
  const name = form.sneakerName.trim();
  const brand = form.brandName.trim();
  const url = form.sneakerImageUrl.trim();
  const price = String(form.retailPriceK).trim();

  if (!name) errors.sneakerName = 'Sneaker name is required.';
  else if (name.length < 2) errors.sneakerName = 'Sneaker name must contain at least 2 characters.';

  if (!brand) errors.brandName = 'Brand name is required.';
  else if (brand.split(/\s+/).filter(Boolean).length < 2) errors.brandName = 'Brand name must consist of at least 2 words.';

  if (!form.sneakerCategory) errors.sneakerCategory = 'Please select a sneaker category.';
  else if (!CATEGORIES.includes(form.sneakerCategory)) errors.sneakerCategory = 'Invalid sneaker category.';

  if (!url) errors.sneakerImageUrl = 'Image URL is required.';
  else if (!isValidUrl(url)) errors.sneakerImageUrl = 'Image URL must be a valid URL.';

  if (!price) errors.retailPriceK = 'Retail price is required.';
  else if (!/^[1-9]\d{0,2}$/.test(price)) errors.retailPriceK = 'Retail price must be a positive integer of at most 3 digits.';

  return errors;
}