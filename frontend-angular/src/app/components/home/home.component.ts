import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Timeless Elegance</h1>
          <p class="hero-subtitle">Discover our exquisite collection of luxury jewellery</p>
          <button class="btn-primary" data-testid="explore-btn">Explore Collection</button>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">Shop By Category</h2>
          <div class="categories-grid">
            <div class="category-card" data-testid="category-rings">
              <div class="category-image">
                <img src="https://images.pexels.com/photos/2732096/pexels-photo-2732096.jpeg" alt="Rings">
              </div>
              <h3 class="category-name">Rings</h3>
            </div>
            <div class="category-card" data-testid="category-earrings">
              <div class="category-image">
                <img src="https://images.pexels.com/photos/5737290/pexels-photo-5737290.jpeg" alt="Earrings">
              </div>
              <h3 class="category-name">Earrings</h3>
            </div>
            <div class="category-card" data-testid="category-necklaces">
              <div class="category-image">
                <img src="https://images.pexels.com/photos/4295007/pexels-photo-4295007.jpeg" alt="Necklaces">
              </div>
              <h3 class="category-name">Necklaces</h3>
            </div>
            <div class="category-card" data-testid="category-bracelets">
              <div class="category-image">
                <img src="https://images.pexels.com/photos/34399114/pexels-photo-34399114.jpeg" alt="Bracelets">
              </div>
              <h3 class="category-name">Bracelets</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Request CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">Create Your Dream Piece</h2>
            <p class="cta-text">Work with our artisans to design custom jewellery that reflects your unique style</p>
            <button class="btn-outline" data-testid="custom-request-btn">Request Custom Design</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), 
                  url('https://images.unsplash.com/photo-1769305171851-897e01aa095c') center/cover;
      text-align: center;
      padding: 0 24px;
    }

    .hero-content {
      max-width: 800px;
    }

    .hero-title {
      font-size: 5rem;
      font-weight: 700;
      color: #C6A87C;
      margin-bottom: 24px;
      letter-spacing: -1px;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #FAFAFA;
      margin-bottom: 48px;
      letter-spacing: 1px;
    }

    .categories-section {
      padding: 120px 24px;
    }

    .section-title {
      text-align: center;
      font-size: 3rem;
      color: #C6A87C;
      margin-bottom: 64px;
      letter-spacing: 2px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .category-card {
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-8px);
    }

    .category-image {
      aspect-ratio: 3/4;
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .category-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .category-card:hover .category-image img {
      transform: scale(1.1);
    }

    .category-name {
      text-align: center;
      font-size: 1.5rem;
      color: #FAFAFA;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .cta-section {
      padding: 120px 24px;
      background-color: #0a0a0a;
      border-top: 1px solid rgba(198, 168, 124, 0.2);
      border-bottom: 1px solid rgba(198, 168, 124, 0.2);
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .cta-title {
      font-size: 3rem;
      color: #C6A87C;
      margin-bottom: 24px;
    }

    .cta-text {
      font-size: 1.125rem;
      color: #A1A1AA;
      margin-bottom: 48px;
      line-height: 1.8;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 3rem;
      }
      
      .section-title, .cta-title {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent {}
