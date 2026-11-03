// src/webauthn/index.js — passkeys (WebAuthn), the thin layer over @simplewebauthn/server (lessons 7.4, 7.5).
// LabFlow ID does NOT hand-roll the CBOR/COSE/attestation parsing — that is a library's job. What it owns is the policy:
// the RP ID and the expected origin. The authenticator signs over BOTH, so verification binds the assertion to this
// exact site — the one line (expectedOrigin / expectedRPID) that makes a phishing site's stolen challenge useless (7.4).
import {
  generateRegistrationOptions, verifyRegistrationResponse,
  generateAuthenticationOptions, verifyAuthenticationResponse,
} from '@simplewebauthn/server';

export function makeWebAuthn({ rpID, rpName = 'LabFlow ID', origin }) {
  return {
    rpID, origin,
    // Registration ceremony, step 1: the server hands the browser a challenge + who it is.
    registrationOptions: (user, excludeCredentials = []) => generateRegistrationOptions({
      rpName, rpID, userName: user.email, userID: new TextEncoder().encode(user.id),
      attestationType: 'none', excludeCredentials,
      authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
    }),
    // Registration ceremony, step 2: verify what the authenticator created, bound to THIS rpID + origin.
    verifyRegistration: (response, expectedChallenge) => verifyRegistrationResponse({
      response, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false,
    }),
    // Authentication ceremony, step 1.
    authenticationOptions: (allowCredentials = []) => generateAuthenticationOptions({ rpID, allowCredentials, userVerification: 'preferred' }),
    // Authentication ceremony, step 2: verify the assertion's signature against the stored public key, bound to origin.
    // `expected` lets a demo override expectedOrigin/expectedRPID to show that a mismatch (phishing) fails.
    verifyAuthentication: (response, expectedChallenge, credential, expected = {}) => verifyAuthenticationResponse({
      response, expectedChallenge,
      expectedOrigin: expected.origin ?? origin, expectedRPID: expected.rpID ?? rpID,
      credential, requireUserVerification: false,
    }),
  };
}
