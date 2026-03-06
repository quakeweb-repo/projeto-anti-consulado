import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getGeosampaData,
  getPhotoCollection,
  getFireExitData,
  getSocialMediaData,
  getGoogleData,
  getOwaspCompliance
} from './miningService.js';

describe('miningService', () => {
  it('returns geosampa details object', () => {
    const data = getGeosampaData();
    assert(data.zona);
    assert(Array.isArray(data.riscos));
  });

  it('returns photo collection array', () => {
    const pics = getPhotoCollection();
    assert(Array.isArray(pics.images));
    assert(pics.images.length > 0);
  });

  it('returns fire exit information', () => {
    const exits = getFireExitData();
    assert(typeof exits.count === 'number');
    assert(Array.isArray(exits.locations));
  });

  it('includes social media profiles', () => {
    const social = getSocialMediaData();
    assert(Array.isArray(social.profiles));
    assert(social.profiles.length >= 1);
  });

  it('provides google search/street view info', () => {
    const google = getGoogleData();
    assert(google.streetView);
    assert(Array.isArray(google.searchResults));
  });

  it('documents owasp compliance principles', () => {
    const owasp = getOwaspCompliance();
    assert(Array.isArray(owasp.principles));
    assert(owasp.principles.length >= 3);
  });
});